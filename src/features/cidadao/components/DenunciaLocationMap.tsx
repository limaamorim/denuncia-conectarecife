import { useEffect, useMemo, useRef, useState } from "react";
import L, { type LeafletMouseEvent, type Map, type Marker } from "leaflet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crosshair, LocateFixed } from "lucide-react";
import { toast } from "sonner";

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

const RECIFE = { lat: -8.0476, lng: -34.877 };

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
    road?: string;
    pedestrian?: string;
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

async function reverseGeocode(lat: number, lng: number): Promise<LocalizacaoCompleta> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
      String(lat),
    )}&lon=${encodeURIComponent(String(lng))}&zoom=18&addressdetails=1`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("reverse fail");
    const json = await res.json();
    const parts = normalizeParts(json);
    return {
      enderecoCompleto:
        parts.enderecoCompleto || `Latitude ${lat.toFixed(5)}, Longitude ${lng.toFixed(5)}`,
      bairro: parts.bairro || "(não informado)",
      cidade: parts.cidade || "(não informado)",
      estado: parts.estado || "(não informado)",
      cep: parts.cep,
      lat,
      lng,
    };
  } catch {
    return {
      enderecoCompleto: `Latitude ${lat.toFixed(5)}, Longitude ${lng.toFixed(5)}`,
      bairro: "(não informado)",
      cidade: "(não informado)",
      estado: "(não informado)",
      lat,
      lng,
    };
  }
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
  const [locating, setLocating] = useState(false);

  type NominatimSuggestion = {
    place_id?: number | string;
    osm_id?: number | string;
    display_name: string;
    lat: string;
    lon: string;
  };

  const [suggestions, setSuggestions] = useState<NominatimSuggestion[]>([]);

  const initialZoom = 13;

  const placeMarker = async (lat: number, lng: number, animate = true) => {
    const map = mapRef.current;
    if (!map) return;
    if (animate) map.setView([lat, lng], Math.max(map.getZoom(), 16), { animate: true });

    const loc = await reverseGeocode(lat, lng);

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], { title: "Ocorrência selecionada" }).addTo(map);
    }
    markerRef.current
      .bindPopup(`<strong>Local selecionado</strong><br/>${loc.enderecoCompleto}`)
      .openPopup();

    onLocationPicked?.(loc);
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      await import("leaflet/dist/leaflet.css");
      if (!mounted || !mapElRef.current) return;

      const map = L.map(mapElRef.current, { zoomControl: true, preferCanvas: true }).setView(
        [initialCenter.lat, initialCenter.lng],
        initialZoom,
      );
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const onClick = async (e: LeafletMouseEvent) => {
        setIsSearching(true);
        try {
          await placeMarker(e.latlng.lat, e.latlng.lng, false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const finalQ = queryClean.match(/\b\d{5}-?\d{3}\b/) ? queryClean : `${queryClean} Recife`;
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=8&q=${encodeURIComponent(
        finalQ,
      )}`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("search fail");
      const json = (await res.json()) as NominatimSuggestion[];
      if (!Array.isArray(json) || json.length === 0) {
        toast.error("Nada encontrado. Tente outro termo.");
        return;
      }
      setSuggestions(json);
      const pick = json[0];
      await placeMarker(Number(pick.lat), Number(pick.lon));
    } catch {
      toast.error("Falha ao buscar localização.");
    } finally {
      setIsSearching(false);
    }
  };

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocalização não suportada neste navegador.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await placeMarker(pos.coords.latitude, pos.coords.longitude);
          toast.success("Localização capturada.");
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        toast.error(
          err.code === err.PERMISSION_DENIED
            ? "Permissão de localização negada."
            : "Não foi possível obter sua localização.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const centralizar = () => {
    const map = mapRef.current;
    if (!map) return;
    const m = markerRef.current;
    if (m) {
      map.setView(m.getLatLng(), 16, { animate: true });
    } else {
      map.setView([RECIFE.lat, RECIFE.lng], initialZoom, { animate: true });
    }
  };

  return (
    <div className="space-y-2 rounded-xl border overflow-hidden">
      <div className="flex flex-wrap gap-2 p-3 pb-0">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchNow(query)}
          placeholder="Buscar endereço, CEP ou referência..."
          className="h-9 flex-1 min-w-[180px]"
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={useMyLocation}
          disabled={locating}
          title="Usar minha localização atual"
        >
          <LocateFixed className="h-4 w-4" />
          <span className="hidden sm:inline">{locating ? "Localizando..." : "Minha localização"}</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={centralizar}
          title="Centralizar mapa"
        >
          <Crosshair className="h-4 w-4" />
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

      <div ref={mapElRef} style={{ height }} className="border-t" />

      <p className="px-3 pb-3 text-xs text-muted-foreground">
        Clique no mapa, use sua localização atual ou busque por endereço.
      </p>
    </div>
  );
}
