import { denuncias as allDenuncias } from "@/data/denuncias";
import type { Denuncia } from "@/types/denuncia";

export function MockMap({
  height = 380,
  items = allDenuncias,
}: {
  height?: number;
  items?: Denuncia[];
}) {
  const pts = items.map((d, i) => ({
    x: 5 + (((d.lng + 35) * 1000) % 90),
    y: 5 + (((d.lat + 8.1) * 1000) % 88),
    cat: d.categoria,
    id: d.id,
    i,
  }));

  // Marcadores em vermelho (institucional) preservados conforme regra do projeto
  const MARKER_COLOR = "var(--destructive)";

  return (
    <div
      className="relative overflow-hidden rounded-xl border bg-[oklch(0.97_0.015_230)]"
      style={{ height }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <defs>
          <pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
            <path
              d="M 6 0 L 0 0 0 6"
              fill="none"
              stroke="oklch(0.88 0.02 230)"
              strokeWidth="0.15"
            />
          </pattern>
          <radialGradient id="heat" cx="50%" cy="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>

          <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0.6" stdDeviation="0.7" floodColor="#000" floodOpacity="0.25" />
          </filter>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        <path
          d="M0 60 Q 30 50 50 65 T 100 55"
          stroke="oklch(0.78 0.08 230)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M20 0 Q 25 30 40 50 T 60 100"
          stroke="oklch(0.78 0.08 230)"
          strokeWidth="1.2"
          fill="none"
          opacity="0.5"
        />
        <circle cx="30" cy="40" r="22" fill="url(#heat)" />
        <circle cx="70" cy="65" r="18" fill="url(#heat)" />
        <circle cx="55" cy="25" r="14" fill="url(#heat)" />

        {pts.map((p) => (
          <g
            key={p.id}
            transform={`translate(${p.x} ${p.y})`}
            className="cursor-pointer"
          >
            <title>Ocorrência (#{p.id})</title>

            {/* Pin só vermelho no local */}
            <path
              d="M 0 -4 C 2.6 -4 4.7 -1.9 4.7 0.5 C 4.7 2.9 2.1 5.9 0 7.9 C -2.1 5.9 -4.7 2.9 -4.7 0.5 C -4.7 -1.9 -2.6 -4 0 -4 Z"
              fill={MARKER_COLOR}
              stroke="#fff"
              strokeWidth="0.5"
              filter="url(#pinShadow)"
            />
          </g>
        ))}
      </svg>
      <div className="absolute bottom-3 left-3 rounded-lg border bg-card/90 px-3 py-2 text-xs shadow-soft backdrop-blur">
        <div className="font-semibold text-foreground mb-1">Mapa Inteligente • Recife</div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: MARKER_COLOR }} />
          {pts.length} ocorrência(s)
        </div>
      </div>
    </div>
  );
}
