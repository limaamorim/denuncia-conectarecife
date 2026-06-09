import { useEffect, useRef, useState } from "react";
import L, { type Map as LMap, type Marker as LMarker, type LayerGroup } from "leaflet";
import type { Denuncia } from "@/types/denuncia";
import { Button } from "@/components/ui/button";
import { Layers, MapPin, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const RECIFE: [number, number] = [-8.0476, -34.877];
const DEFAULT_ZOOM = 12;

type Mode = "markers" | "heatmap";

type Props = {
  items: Denuncia[];
  height?: number;
  onSelect?: (d: Denuncia) => void;
};

// Cores institucionais por urgência
function urgenciaColor(u?: string) {
  if (u === "Alta") return "var(--destructive)";
  if (u === "Média") return "oklch(0.72 0.18 70)"; // amarelo/laranja
  return "var(--destructive)"; // padrão vermelho (regra do projeto)
}

function buildIcon(d: Denuncia) {
  const color = urgenciaColor(d.iaUrgencia);
  return (L as unknown as {
    divIcon: (o: Record<string, unknown>) => unknown;
  }).divIcon({
    className: "",
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.35)"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function tooltipHtml(d: Denuncia) {
  return `
    <div style="font-size:12px;line-height:1.35;min-width:160px">
      <div style="font-weight:600;color:#0B438E">${escapeHtml(d.titulo)}</div>
      <div style="color:#475569">${escapeHtml(d.categoria)} • ${escapeHtml(d.bairro)}</div>
      <div style="margin-top:2px"><span style="display:inline-block;padding:1px 6px;border-radius:999px;background:#E2E8F0;font-size:10px;color:#0f172a">${escapeHtml(d.status)}</span></div>
    </div>`;
}

function popupHtml(d: Denuncia) {
  const data = new Date(d.data).toLocaleString("pt-BR");
  const endereco = d.endereco ? `<div><b>Endereço:</b> ${escapeHtml(d.endereco)}</div>` : "";
  const urgencia = d.iaUrgencia
    ? `<div><b>Urgência:</b> ${escapeHtml(d.iaUrgencia)} (${d.iaConfianca}% IA)</div>`
    : "";
  return `
    <div style="font-size:12px;line-height:1.45;max-width:260px">
      <div style="font-family:ui-monospace,monospace;color:#0B438E;font-size:11px">${escapeHtml(d.protocolo)} · ${escapeHtml(d.id)}</div>
      <div style="font-weight:600;font-size:13px;margin-top:2px">${escapeHtml(d.titulo)}</div>
      <div style="margin-top:4px;color:#334155">
        <div><b>Categoria:</b> ${escapeHtml(d.categoria)}</div>
        <div><b>Status:</b> ${escapeHtml(d.status)}</div>
        <div><b>Bairro:</b> ${escapeHtml(d.bairro)}</div>
        ${endereco}
        <div><b>Data:</b> ${escapeHtml(data)}</div>
        ${urgencia}
      </div>
      <div style="margin-top:6px;color:#475569"><b>Descrição:</b> ${escapeHtml(d.descricao)}</div>
      <button data-detalhar="${escapeHtml(d.id)}" style="margin-top:8px;background:#00A4E4;color:#fff;border:none;border-radius:6px;padding:6px 10px;font-size:12px;cursor:pointer;font-weight:600">Ver detalhes</button>
    </div>`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

export function AdminRealMap({ items, height = 460, onSelect }: Props) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LMap | null>(null);
  const clusterRef = useRef<unknown>(null);
  const heatRef = useRef<unknown>(null);
  const readyRef = useRef(false);
  const [mode, setMode] = useState<Mode>("markers");
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Boot map
  useEffect(() => {
    let mounted = true;
    (async () => {
      await import("leaflet/dist/leaflet.css");
      await import("leaflet.markercluster/dist/MarkerCluster.css");
      await import("leaflet.markercluster/dist/MarkerCluster.Default.css");
      await import("leaflet.markercluster");
      await import("leaflet.heat");
      if (!mounted || !elRef.current) return;

      const map = L.map(elRef.current, {
        zoomControl: true,
        preferCanvas: true,
      }).setView(RECIFE, DEFAULT_ZOOM);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Delegated handler for "Ver detalhes" buttons inside popups
      elRef.current.addEventListener("click", (ev) => {
        const target = ev.target as HTMLElement | null;
        const id = target?.getAttribute?.("data-detalhar");
        if (id && onSelectRef.current) {
          const d = itemsRef.current.find((x) => x.id === id);
          if (d) onSelectRef.current(d);
        }
      });

      readyRef.current = true;
      // trigger first render of layers
      renderLayers();
    })();
    return () => {
      mounted = false;
      readyRef.current = false;
      mapRef.current?.remove();
      mapRef.current = null;
      clusterRef.current = null;
      heatRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itemsRef = useRef(items);
  itemsRef.current = items;

  // Render layers when items or mode change
  const renderLayers = () => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    const Lany = L as unknown as {
      markerClusterGroup: (o?: Record<string, unknown>) => LayerGroup;
      heatLayer: (
        pts: Array<[number, number, number?]>,
        opts?: Record<string, unknown>,
      ) => { addTo: (m: LMap) => unknown };
      marker: (
        latlng: [number, number],
        opts?: Record<string, unknown>,
      ) => LMarker;
    };

    // Clear previous layers
    if (clusterRef.current) {
      map.removeLayer(clusterRef.current);
      clusterRef.current = null;
    }
    if (heatRef.current) {
      map.removeLayer(heatRef.current);
      heatRef.current = null;
    }

    const data = itemsRef.current;
    if (!data.length) return;

    if (mode === "markers") {
      const cluster = Lany.markerClusterGroup({
        chunkedLoading: true,
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        maxClusterRadius: 45,
      });
      for (const d of data) {
        const m = Lany.marker([d.lat, d.lng], { icon: buildIcon(d) });
        m.bindTooltip(tooltipHtml(d), { direction: "top", offset: [0, -8], opacity: 1 });
        m.bindPopup(popupHtml(d), { maxWidth: 280 });
        cluster.addLayer(m);
      }
      cluster.addTo(map);
      clusterRef.current = cluster;
    } else {
      const pts: Array<[number, number, number]> = data.map((d) => {
        const w = d.iaUrgencia === "Alta" ? 1 : d.iaUrgencia === "Média" ? 0.6 : 0.35;
        return [d.lat, d.lng, w];
      });
      const heat = Lany.heatLayer(pts, {
        radius: 28,
        blur: 22,
        maxZoom: 17,
        gradient: {
          0.2: "#00A4E4",
          0.5: "#FBBF24",
          0.8: "#F97316",
          1.0: "#DC2626",
        },
      });
      heat.addTo(map);
      heatRef.current = heat;
    }

    // Fit bounds to visible points
    if (data.length > 1) {
      const bounds = L.latLngBounds(data.map((d) => [d.lat, d.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 });
    } else {
      map.setView([data[0].lat, data[0].lng], 15);
    }
  };

  // Re-render layers when items or mode change
  useEffect(() => {
    renderLayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, mode]);

  return (
    <div className="relative overflow-hidden rounded-xl border">
      <div className="absolute right-3 top-3 z-[400] flex gap-1 rounded-lg border bg-card/95 p-1 shadow-soft backdrop-blur">
        <Button
          type="button"
          size="sm"
          variant={mode === "markers" ? "default" : "ghost"}
          className={cn("h-8 gap-1.5 text-xs", mode === "markers" && "bg-primary hover:bg-primary/90")}
          onClick={() => setMode("markers")}
        >
          <MapPin className="h-3.5 w-3.5" /> Marcadores
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "heatmap" ? "default" : "ghost"}
          className={cn("h-8 gap-1.5 text-xs", mode === "heatmap" && "bg-primary hover:bg-primary/90")}
          onClick={() => setMode("heatmap")}
        >
          <Flame className="h-3.5 w-3.5" /> Heatmap
        </Button>
      </div>
      <div className="absolute left-3 top-3 z-[400] rounded-lg border bg-card/95 px-3 py-1.5 text-xs shadow-soft backdrop-blur flex items-center gap-1.5">
        <Layers className="h-3.5 w-3.5 text-accent" />
        <span className="font-semibold text-foreground">{items.length}</span>
        <span className="text-muted-foreground">ocorrência(s)</span>
      </div>
      <div ref={elRef} style={{ height }} />
    </div>
  );
}
