import type { Category } from "@/types/denuncia";
import { Sparkles } from "lucide-react";

const SUGESTOES: Partial<Record<Category, string[]>> = {
  "Iluminação Pública": [
    "Poste apagado",
    "Rua sem iluminação",
    "Luminária danificada",
    "Falta de iluminação pública",
  ],
  "Iluminação": [
    "Poste sem luz",
    "Lâmpada queimada",
    "Iluminação intermitente",
  ],
  "Buracos em Vias": [
    "Buraco em via principal",
    "Pavimentação danificada",
    "Asfalto deteriorado",
    "Risco de acidente",
  ],
  "Vias": ["Buraco grande na via", "Calçada destruída", "Sinalização apagada"],
  "Violência Doméstica": [
    "Suspeita de violência doméstica",
    "Agressão recorrente",
    "Violência familiar",
    "Pedido de averiguação",
  ],
  "Violência Física": [
    "Agressão em via pública",
    "Briga com vítimas",
    "Pessoa ferida",
  ],
  "Violência Sexual": [
    "Suspeita de abuso",
    "Importunação sexual",
    "Pedido de proteção urgente",
  ],
  "Maus-tratos a Animais": [
    "Animal ferido em via pública",
    "Suspeita de maus-tratos",
    "Animal abandonado",
  ],
  "Crimes Ambientais": [
    "Desmatamento ilegal",
    "Poluição de rio",
    "Queimada criminosa",
  ],
  "Fraude / Golpe": [
    "Golpe do PIX",
    "Estelionato",
    "Fraude com documentos",
  ],
  "Saneamento": [
    "Vazamento de esgoto",
    "Bueiro entupido",
    "Água parada na rua",
  ],
  "Coleta de Lixo": [
    "Lixo acumulado",
    "Falha na coleta",
    "Container quebrado",
  ],
  "Problemas Urbanos": [
    "Calçada quebrada",
    "Praça abandonada",
    "Sinalização danificada",
  ],
  "Meio Ambiente": ["Descarte irregular", "Árvore caída", "Poluição em córrego"],
  "Limpeza": ["Acúmulo de lixo", "Entulho na esquina"],
  "Outros": ["Outra ocorrência"],
};

export function TitleSuggestions({
  categoria,
  onPick,
}: {
  categoria: Category | null;
  onPick: (s: string) => void;
}) {
  if (!categoria) return null;
  const list = SUGESTOES[categoria] ?? [];
  if (list.length === 0) return null;

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="h-3 w-3 text-accent" /> Sugestões inteligentes
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent transition hover:bg-accent hover:text-accent-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
