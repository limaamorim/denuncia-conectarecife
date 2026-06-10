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
        <h3 className="text-lg font-semibold text-foreground">Processando denúncia...</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Nossa IA está classificando categoria, urgência e prioridade de despacho.
        </p>
      </div>
    );
  }

 if (!result) return null;

return (
  <div className="space-y-4 animate-fade-in text-center">
    <div className="flex justify-center">
      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-card">
        <Sparkles className="h-7 w-7 text-primary-foreground" />
      </div>
    </div>

    <h3 className="text-lg font-semibold text-foreground">
      Denúncia pronta para envio
    </h3>

    <p className="text-sm text-muted-foreground max-w-md mx-auto">
      Sua denúncia foi processada e será encaminhada para análise da equipe responsável.
    </p>

    <div className="flex justify-end">
      <Button
        className="bg-primary hover:bg-primary/90"
        onClick={() => onComplete(result)}
      >
        Concluir envio
      </Button>
    </div>
  </div>
);
}
