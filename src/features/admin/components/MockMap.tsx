import { denuncias } from "@/data/denuncias";

export function MockMap({ height = 380 }: { height?: number }) {
  const pts = denuncias.map((d, i) => ({
    x: 5 + (((d.lng + 35) * 1000) % 90),
    y: 5 + (((d.lat + 8.1) * 1000) % 88),
    cat: d.categoria,
    id: d.id,
    i,
  }));

  const colorFor = (c: string) =>
    c === "Iluminação"
      ? "var(--warning)"
      : c === "Vias"
        ? "var(--primary)"
        : c === "Saneamento"
          ? "var(--accent)"
          : c === "Meio Ambiente"
            ? "var(--success)"
            : "var(--destructive)";

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
          <g key={p.id}>
            <circle
              cx={p.x}
              cy={p.y}
              r="1.6"
              fill={colorFor(p.cat)}
              stroke="#fff"
              strokeWidth="0.3"
            />
          </g>
        ))}
      </svg>
      <div className="absolute bottom-3 left-3 rounded-lg border bg-card/90 px-3 py-2 text-xs shadow-soft backdrop-blur">
        <div className="font-semibold text-foreground mb-1">Mapa Inteligente • Recife</div>
        <div className="flex flex-wrap gap-2 text-muted-foreground">
          {["Iluminação", "Vias", "Saneamento", "Meio Ambiente", "Limpeza"].map((c) => (
            <span key={c} className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ background: colorFor(c) }} />
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
