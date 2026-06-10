import { useState } from "react";
import type { Denuncia } from "@/types/denuncia";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CheckCircle2, Circle, MapPin, ImageIcon } from "lucide-react";

export function DetalhesDenuncia({ d }: { d: Denuncia }) {
  const [zoom, setZoom] = useState<string | null>(null);
  const midias = d.midias ?? [];

  const dataAbertura = d.data
    ? new Date(d.data).toLocaleDateString("pt-BR")
    : "—";

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

      <div className="mt-5 space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">
            Informações da denúncia
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="text-xs text-muted-foreground">Categoria</div>
              <div className="font-medium">{d.categoria}</div>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="text-xs text-muted-foreground">Data de abertura</div>
              <div className="font-medium">{dataAbertura}</div>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 col-span-2">
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="font-medium">{d.status}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary" /> Localização
          </h4>
          <div className="rounded-lg border bg-muted/30 p-3 text-sm">
            <div className="space-y-2">
              <div>
                <div className="text-xs text-muted-foreground">Rua, número</div>
                <div className="font-medium">{d.endereco || "(não informado)"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Bairro</div>
                <div className="font-medium">{d.bairro || "(não informado)"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Cidade</div>
                <div className="font-medium">{d.cidade || "(não informado)"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">CEP</div>
                <div className="font-medium">{d.cep || "(não informado)"}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <ImageIcon className="h-4 w-4 text-primary" /> Evidências
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
              {midias.length}
            </span>
          </h4>
          {midias.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
              📷 Nenhuma evidência foi enviada para esta denúncia.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {midias.map((m, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setZoom(m.url)}
                  className="group relative aspect-square overflow-hidden rounded-lg border bg-muted hover:ring-2 hover:ring-accent transition"
                  title={m.nome ?? "Evidência"}
                >
                  <img
                    src={m.url}
                    alt={m.nome ?? `Evidência ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <Dialog open={!!zoom} onOpenChange={(o) => !o && setZoom(null)}>
          <DialogContent className="max-w-3xl p-2 bg-background">
            {zoom && (
              <img
                src={zoom}
                alt="Evidência ampliada"
                className="w-full h-auto rounded-md"
              />
            )}
          </DialogContent>
        </Dialog>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Linha do tempo
          </h4>
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
      </div>
    </>
  );
}

