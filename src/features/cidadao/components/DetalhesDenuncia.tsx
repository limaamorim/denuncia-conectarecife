import { useState } from "react";
import type { Denuncia } from "@/types/denuncia";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CheckCircle2, Circle, Sparkles, ShieldAlert, MapPin, ImageIcon } from "lucide-react";
import { urgenciaColorClasses } from "@/lib/urgencia";
import { DenunciaDetailMap } from "@/features/cidadao/components/DenunciaDetailMap";

export function DetalhesDenuncia({ d }: { d: Denuncia }) {
  const u = urgenciaColorClasses(d.iaUrgencia);
  const [zoom, setZoom] = useState<string | null>(null);
  const midias = d.midias ?? [];
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

      {d.iaUrgencia && (
        <div className={`mt-4 rounded-lg border ${u.border} ${u.bg} p-3`}>
          <div className="flex items-center gap-2">
            <ShieldAlert className={`h-4 w-4 ${u.text}`} />
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Classificação de urgência
            </div>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${u.dot}`} />
            <span className="font-semibold text-foreground">{u.label}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {d.iaConfianca}% confiança
            </span>
          </div>
          {d.iaUrgenciaMotivo && (
            <p className="mt-2 text-xs text-foreground/80">{d.iaUrgenciaMotivo}</p>
          )}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="text-xs text-muted-foreground">Categoria</div>
          <div className="font-medium">{d.categoria}</div>
        </div>
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="text-xs text-muted-foreground">Bairro</div>
          <div className="font-medium">{d.bairro}</div>
        </div>
        {d.endereco && (
          <div className="rounded-lg border bg-muted/30 p-3 col-span-2">
            <div className="text-xs text-muted-foreground">Endereço</div>
            <div className="font-medium text-sm">{d.endereco}</div>
          </div>
        )}
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
