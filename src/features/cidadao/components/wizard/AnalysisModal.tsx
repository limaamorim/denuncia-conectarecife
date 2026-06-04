import { useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import type { Category, Urgencia } from "@/types/denuncia";
import { classificarUrgencia, urgenciaColorClasses } from "@/lib/urgencia";
import { Button } from "@/components/ui/button";

export function AnalysisModal({
  categoria,
  onComplete,
}: {
  categoria: Category;
  onComplete: (r: { urgencia: Urgencia; motivo: string; confianca: number }) => void;
}) {
  const [phase, setPhase] = useState<"analisando" | "pronto">("analisando");
  const [result, setResult] = useState<ReturnType<typeof classificarUrgencia> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const r = classificarUrgencia(categoria);
      setResult(r);
      setPhase("pronto");
    }, 1800);
    return () => clearTimeout(t);
  }, [categoria]);

  if (phase === "analisando") {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
        <div className="relative mb-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-card">
            <Sparkles className="h-7 w-7 text-primary-foreground animate-pulse" />
          </div>
          <Loader2 className="absolute -inset-2 h-20 w-20 text-accent/40 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Analisando denúncia...</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Nossa IA está classificando categoria, urgência e prioridade de despacho.
        </p>
      </div>
    );
  }

  if (!result) return null;
  const c = urgenciaColorClasses(result.urgencia);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent" />
        <h3 className="text-base font-semibold text-foreground">Análise concluída</h3>
      </div>
      <div className={`rounded-xl border ${c.border} ${c.bg} p-5`}>
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${c.dot}`} />
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Nível de urgência
          </div>
        </div>
        <div className="mt-1 text-2xl font-bold text-foreground">{c.label}</div>
        <p className="mt-3 text-sm text-foreground/80">{result.motivo}</p>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Confiança da IA</span>
            <span className="font-semibold text-foreground">{result.confianca}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-primary transition-[width] duration-700"
              style={{ width: `${result.confianca}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90" onClick={() => onComplete(result)}>
          Concluir envio
        </Button>
      </div>
    </div>
  );
}
