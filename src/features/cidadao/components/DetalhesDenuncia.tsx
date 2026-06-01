import type { Denuncia } from "@/types/denuncia";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";

export function DetalhesDenuncia({ d }: { d: Denuncia }) {
  return (
    <>
      <SheetHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-xs text-primary">{d.protocolo}</div>
            <SheetTitle className="mt-1 text-xl">{d.titulo}</SheetTitle>
          </div>
          <StatusBadge status={d.status} />
        </div>
        <SheetDescription>{d.descricao}</SheetDescription>
      </SheetHeader>
      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="text-xs text-muted-foreground">Categoria</div>
          <div className="font-medium">{d.categoria}</div>
        </div>
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="text-xs text-muted-foreground">Bairro</div>
          <div className="font-medium">{d.bairro}</div>
        </div>
        <div className="rounded-lg border bg-muted/30 p-3 col-span-2">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Sugestão da IA
          </div>
          <div className="font-medium">
            {d.iaSugestao} — {d.iaConfianca}% confiança
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-foreground mb-3">Linha do tempo</h4>
        <ol className="relative space-y-4 border-l-2 border-border pl-5">
          {d.timeline.map((t, i) => (
            <li key={i} className="relative">
              <span
                className={`absolute -left-[27px] flex h-5 w-5 items-center justify-center rounded-full ${t.done ? "bg-success text-success-foreground" : "bg-muted border"}`}
              >
                {t.done ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <Circle className="h-3 w-3 text-muted-foreground" />
                )}
              </span>
              <div className="text-sm font-medium text-foreground">{t.label}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(t.date).toLocaleString("pt-BR")}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
