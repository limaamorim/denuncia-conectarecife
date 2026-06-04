import type { Category } from "@/types/denuncia";
import { cn } from "@/lib/utils";
import {
  ShieldAlert,
  Home,
  HeartCrack,
  PawPrint,
  Trees,
  CreditCard,
  Building2,
  Lightbulb,
  Construction,
  Droplets,
  Trash2,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

type CatDef = { key: Category; label: string; icon: LucideIcon; tone: string };

export const CATEGORIES: CatDef[] = [
  { key: "Violência Física", label: "Violência Física", icon: ShieldAlert, tone: "destructive" },
  { key: "Violência Doméstica", label: "Violência Doméstica", icon: Home, tone: "destructive" },
  { key: "Violência Sexual", label: "Violência Sexual", icon: HeartCrack, tone: "destructive" },
  { key: "Maus-tratos a Animais", label: "Maus-tratos a Animais", icon: PawPrint, tone: "warning" },
  { key: "Crimes Ambientais", label: "Crimes Ambientais", icon: Trees, tone: "destructive" },
  { key: "Fraude / Golpe", label: "Fraude / Golpe", icon: CreditCard, tone: "warning" },
  { key: "Problemas Urbanos", label: "Problemas Urbanos", icon: Building2, tone: "primary" },
  { key: "Iluminação Pública", label: "Iluminação Pública", icon: Lightbulb, tone: "primary" },
  { key: "Buracos em Vias", label: "Buracos em Vias", icon: Construction, tone: "primary" },
  { key: "Saneamento", label: "Saneamento", icon: Droplets, tone: "accent" },
  { key: "Coleta de Lixo", label: "Coleta de Lixo", icon: Trash2, tone: "accent" },
  { key: "Outros", label: "Outros", icon: HelpCircle, tone: "muted" },
];

const toneClass: Record<string, string> = {
  destructive: "text-destructive bg-destructive/10",
  warning: "text-warning-foreground bg-warning/20",
  primary: "text-primary bg-primary/10",
  accent: "text-accent bg-accent/10",
  muted: "text-muted-foreground bg-muted",
};

export function CategoryStep({
  selected,
  onSelect,
}: {
  selected: Category | null;
  onSelect: (c: Category) => void;
}) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h3 className="text-base font-semibold text-foreground">Escolha a categoria</h3>
        <p className="text-sm text-muted-foreground">
          Selecione o tipo de ocorrência para iniciar sua denúncia.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const active = selected === c.key;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => onSelect(c.key)}
              className={cn(
                "group relative flex flex-col items-start gap-2 rounded-xl border bg-card p-3 text-left transition-all duration-200",
                "hover:shadow-card hover:-translate-y-0.5 hover:border-accent",
                active
                  ? "border-primary ring-2 ring-primary/30 shadow-card"
                  : "border-border",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
                  toneClass[c.tone],
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium leading-tight text-foreground">{c.label}</span>
              {active && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary animate-scale-in" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
