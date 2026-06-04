import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepKey =
  | "categoria"
  | "info"
  | "localizacao"
  | "evidencias"
  | "revisao"
  | "envio";

export const STEPS: { key: StepKey; label: string }[] = [
  { key: "categoria", label: "Categoria" },
  { key: "info", label: "Informações" },
  { key: "localizacao", label: "Localização" },
  { key: "evidencias", label: "Evidências" },
  { key: "revisao", label: "Revisão" },
  { key: "envio", label: "Envio" },
];

export function Stepper({ current }: { current: StepKey }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);
  const progress = ((currentIdx + 1) / STEPS.length) * 100;

  return (
    <div className="space-y-3">
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <ol className="flex items-center justify-between gap-1">
        {STEPS.map((s, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <li key={s.key} className="flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-all",
                    done && "bg-success text-success-foreground border-success",
                    active &&
                      "bg-primary text-primary-foreground border-primary scale-110 shadow-soft",
                    !done && !active && "bg-background text-muted-foreground border-border",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-[10px] sm:text-xs leading-tight truncate w-full",
                    active ? "text-foreground font-semibold" : "text-muted-foreground",
                  )}
                >
                  {s.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
