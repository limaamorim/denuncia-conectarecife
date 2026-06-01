import { useEffect, useMemo, useRef, useState } from "react";
import L, { type LeafletMouseEvent, type Map, type Marker } from "leaflet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type LocalizacaoCompleta = {
  enderecoCompleto: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep?: string;
  lat: number;
  lng: number;
};

type Props = {
  height?: number;
  initialCenter?: { lat: number; lng: number };
  onLocationPicked?: (loc: LocalizacaoCompleta) => void;
};

const RECIFE = { lat: -8.0476, lng: -34.877 }; // centro aproximado

function safeNominatimQuery(q: string) {
  return q.trim().replace(/\s+/g, " ").replace(/[“”]/g, '"').slice(0, 200);
}

type NominatimReverse = {
  display_name?: string;
  lat?: string | number;
  lon?: string | number;
  address?: {
    neighbourhood?: string;
    suburb?: string;
    city_district?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    region?: string;
    postcode?: string;
  };
};

function normalizeParts(place: NominatimReverse | null | undefined) {
  const bairro =
    place?.address?.neighbourhood || place?.address?.suburb || place?.address?.city_district || "";
  const cidade =
    place?.address?.city ||
    place?.address?.town ||
    place?.address?.village ||
    place?.address?.municipality ||
    "";
  const estado = place?.address?.state || place?.address?.region || "";
  const cep = place?.address?.postcode;
  const enderecoCompleto = place?.display_name || "";
  const lat = place?.lat !== undefined ? Number(place.lat) : undefined;
  const lng = place?.lon !== undefined ? Number(place.lon) : undefined;

  return {
    bairro,
    cidade,
    estado,
    cep,
    enderecoCompleto,
    lat: lat ?? null,
    lng: lng ?? null,
  };
}

export function DenunciaLocationMap({
  height = 380,
  initialCenter = RECIFE,
  onLocationPicked,
}: Props) {
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);

  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  type NominatimSuggestion = {
    place_id?: number | string;
    osm_id?: number | string;
    display_name: string;
    lat: string;
    lon: string;
  };

  const [suggestions, setSuggestions] = useState<NominatimSuggestion[]>([]);

  const initialZoom = 13;

  useEffect(() => {
    let mounted = true;

    (async () => {
      // Leaflet imports CSS; safe to do here (browser only)
      await import("leaflet/dist/leaflet.css");
      if (!mounted) return;

      if (!mapElRef.current) return;

      const map = L.map(mapElRef.current, {
        zoomControl: true,
        preferCanvas: true,
      }).setView([initialCenter.lat, initialCenter.lng], initialZoom);

      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const onClick = async (e: LeafletMouseEvent) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], {
            title: "Ocorrência selecionada",
          }).addTo(map);
        }

        // reverse geocode
        try {
          setIsSearching(true);
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
            String(lat),
          )}&lon=${encodeURIComponent(String(lng))}&zoom=18&addressdetails=1`;

          const res = await fetch(url, {
            headers: {
              // algumas instâncias pedem user-agent; aqui não dá para garantir, mas ajuda.
              Accept: "application/json",
            },
          });

          if (!res.ok) throw new Error(`Nominatim reverse failed: ${res.status}`);

          const json = await res.json();
          const parts = normalizeParts(json);

          const loc: LocalizacaoCompleta = {
            enderecoCompleto:
              parts.enderecoCompleto || `Latitude ${lat.toFixed(5)}, Longitude ${lng.toFixed(5)}`,
            bairro: parts.bairro || "(não informado)",
            cidade: parts.cidade || "(não informado)",
            estado: parts.estado || "(não informado)",
            cep: parts.cep,
            lat,
            lng,
          };

          onLocationPicked?.(loc);
        } catch {
          // Fallback: preencher só lat/lng
          const loc: LocalizacaoCompleta = {
            enderecoCompleto: `Latitude ${lat.toFixed(5)}, Longitude ${lng.toFixed(5)}`,
            bairro: "(não informado)",
            cidade: "(não informado)",
            estado: "(não informado)",
            lat,
            lng,
          };
          onLocationPicked?.(loc);
        } finally {
          setIsSearching(false);
        }
      };

      map.on("click", onClick);
    })();

    return () => {
      mounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [initialCenter.lat, initialCenter.lng]);

  const searchSuggestions = useMemo(() => {
    if (!suggestions?.length) return [];
    return suggestions.slice(0, 6).map((s) => ({
      key: s.place_id ?? s.osm_id ?? s.display_name,
      lat: Number(s.lat),
      lng: Number(s.lon),
      label: s.display_name,
    }));
  }, [suggestions]);

  const searchNow = async (q: string) => {
    const queryClean = safeNominatimQuery(q);
    if (!queryClean) return;

    const map = mapRef.current;
    if (!map) return;

    try {
      setIsSearching(true);
      setSuggestions([]);

      // limit local Recife a ~raio usando viewbox é mais complexo; por performance/escopo, usamos q.
      // Para melhorar precisão, prefixamos por "Recife" quando o usuário não enviar CEP.
      const finalQ = queryClean.match(/\b\d{5}-?\d{3}\b/) ? queryClean : `${queryClean} Recife`;

      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=8&q=${encodeURIComponent(
        finalQ,
      )}`;

      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`Nominatim search failed: ${res.status}`);

      const json = (await res.json()) as unknown;
      if (!Array.isArray(json) || json.length === 0) {
        toastSafe("Nada encontrado. Tente outro termo.");
        return;
      }

      setSuggestions(json as Array<{
        place_id?: number | string;
        osm_id?: number | string;
        display_name: string;
        lat: string;
        lon: string;
      }>);

      const pick = (json as Array<{
        place_id?: number | string;
        osm_id?: number | string;
        display_name: string;
        lat: string;
        lon: string;
      }>)[0];
      const lat = Number(pick.lat);
      const lng = Number(pick.lon);

      map.setView([lat, lng], 16, { animate: true });

      if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
      else markerRef.current = L.marker([lat, lng]).addTo(map);

      // Optionally reverse for full fields
      try {
        const urlR = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
          String(lat),
        )}&lon=${encodeURIComponent(String(lng))}&zoom=18&addressdetails=1`;
        const rr = await fetch(urlR, { headers: { Accept: "application/json" } });
        if (rr.ok) {
          const jr = await rr.json();
          const parts = normalizeParts(jr);
          const loc: LocalizacaoCompleta = {
            enderecoCompleto: parts.enderecoCompleto || pick.display_name || "(não informado)",
            bairro: parts.bairro || "(não informado)",
            cidade: parts.cidade || "(não informado)",
            estado: parts.estado || "(não informado)",
            cep: parts.cep,
            lat,
            lng,
          };
          onLocationPicked?.(loc);
        }
      } catch {
        // ignore
      }
    } catch {
      toastSafe("Falha ao buscar localização. Verifique sua conexão e tente novamente.");
    } finally {
      setIsSearching(false);
    }
  };

  const toastSafe = (msg: string) => {
    // Evita depender de toast() aqui; mantém neutro.
    // Se quiser, pode ser conectado em outro lugar.
    console.warn(msg);
  };

  return (
    <div className="space-y-2 rounded-xl border overflow-hidden">
      <div className="flex gap-2 p-3 pb-0">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchNow(query)}
          placeholder="Buscar endereço, CEP ou referência..."
          className="h-9"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="shrink-0"
          onClick={() => searchNow(query)}
          disabled={isSearching || !query.trim()}
        >
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
      </div>

      {searchSuggestions.length > 0 && (
        <div className="px-3">
          <div className="flex flex-col gap-1 max-h-24 overflow-auto">
            {searchSuggestions.map((s) => (
              <button
                key={s.key}
                type="button"
                className="text-left rounded-md px-2 py-1.5 text-sm hover:bg-muted/60 transition"
                onClick={() => searchNow(s.label)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        ref={mapElRef}
        style={{ height }}
        className="border-t"
      />

      <p className="px-3 pb-3 text-xs text-muted-foreground">
        Clique no mapa para marcar o ponto da ocorrência.
      </p>
    </div>
  );
}
