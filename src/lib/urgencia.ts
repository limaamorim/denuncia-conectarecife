import type { Category, Urgencia } from "@/types/denuncia";

const ALTA: Category[] = [
  "Violência Física",
  "Violência Doméstica",
  "Violência Sexual",
  "Crimes Ambientais",
];

const MEDIA: Category[] = [
  "Maus-tratos a Animais",
  "Fraude / Golpe",
  "Saneamento",
];

const MOTIVOS: Record<Urgencia, string> = {
  Alta: "Possível risco à integridade física das vítimas. Requer atenção prioritária dos órgãos competentes.",
  Média:
    "Situação que pode causar prejuízo material, ambiental ou social. Recomenda-se atendimento em até 72h.",
  Baixa:
    "Demanda urbana de manutenção. Pode ser encaminhada à fila padrão de atendimento.",
};

export function classificarUrgencia(categoria: Category): {
  urgencia: Urgencia;
  motivo: string;
  confianca: number;
} {
  let urgencia: Urgencia = "Baixa";
  if (ALTA.includes(categoria)) urgencia = "Alta";
  else if (MEDIA.includes(categoria)) urgencia = "Média";

  const baseConfianca = urgencia === "Alta" ? 96 : urgencia === "Média" ? 89 : 82;
  // pequena variação determinística por categoria
  const variacao = (categoria.length % 5) - 2;
  const confianca = Math.max(70, Math.min(99, baseConfianca + variacao));

  return { urgencia, motivo: MOTIVOS[urgencia], confianca };
}

export function urgenciaColorClasses(u: Urgencia | undefined) {
  switch (u) {
    case "Alta":
      return {
        dot: "bg-destructive",
        text: "text-destructive",
        bg: "bg-destructive/10",
        border: "border-destructive/30",
        label: "Alta",
      };
    case "Média":
      return {
        dot: "bg-warning",
        text: "text-warning-foreground",
        bg: "bg-warning/15",
        border: "border-warning/40",
        label: "Média",
      };
    case "Baixa":
      return {
        dot: "bg-success",
        text: "text-success",
        bg: "bg-success/10",
        border: "border-success/30",
        label: "Baixa",
      };
    default:
      return {
        dot: "bg-muted-foreground",
        text: "text-muted-foreground",
        bg: "bg-muted",
        border: "border-border",
        label: "—",
      };
  }
}
