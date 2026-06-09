import type { Denuncia } from "@/types/denuncia";
import { useState } from "react";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  CheckCircle2,
  Circle,
  Sparkles,
  ShieldAlert,
  MapPin,
  ImageIcon,
  Hash,
  Calendar,
  Building2,
} from "lucide-react";
import { urgenciaColorClasses } from "@/lib/urgencia";
import { DenunciaDetailMap } from "@/features/cidadao/components/DenunciaDetailMap";

export function AdminDenunciaDetail({ d }: { d: Denuncia }) {
  const u = urgenciaColorClasses(d.iaUrgencia);
  const [zoom, setZoom] = useState<string | null>(null);
  const midias = d.midias ?? [];

  return (
    <>
      <SheetHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs">
              <Hash className="h-3 w-3 text-primary" />
              <span className="font-mono text-primary">{d.protocolo}</span>
              <span className="text-muted-foreground">· {d.id}</span>
            </div>
            <SheetTitle className="mt-1 text-xl">{d.titulo}</SheetTitle>
          </div>
          <StatusBadge status={d.status} />
        </div>
        <SheetDescription>{d.descricao}</SheetDescription>
      </SheetHeader>

      {/* Classificação IA — exclusiva admin */}
      <div className={`mt-4 rounded-xl border ${u.border} ${u.bg} p-4`}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Classificação por IA
          </div>
          <span className="ml-auto text-xs text-muted-foreground">
            {d.iaConfianca}% confiança
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Categoria sugerida</div>
            <div className="font-semibold text-foreground">{d.iaSugestao}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Urgência</div>
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <span className={`h-2 w-2 rounded-full ${u.dot}`} /> {u.label}
            </div>
          </div>
        </div>
        {d.iaUrgenciaMotivo && (
          <div className="mt-3 flex gap-2 rounded-md bg-card/60 p-2 text-xs text-foreground/80">
            <ShieldAlert className={`h-3.5 w-3.5 shrink-0 ${u.text}`} />
            <span>
              <b>Motivo:</b> {d.iaUrgenciaMotivo}
            </span>
          </div>
        )}
        <div className="mt-3">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-primary"
              style={{ width: `${d.iaConfianca}%` }}
            />
          </div>
        </div>
      </div>

      {/* Metadados */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Building2 className="h-3 w-3" /> Categoria
          </div>
          <div className="font-medium">{d.categoria}</div>
        </div>
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="text-xs text-muted-foreground">Bairro</div>
          <div className="font-medium">{d.bairro}</div>
        </div>
        <div className="rounded-lg border bg-muted/30 p-3 col-span-2">
          <div className="text-xs text-muted-foreground">Endereço</div>
          <div className="font-medium text-sm">
            {d.endereco ?? `Lat ${d.lat.toFixed(5)}, Lng ${d.lng.toFixed(5)}`}
          </div>
        </div>
        <div className="rounded-lg border bg-muted/30 p-3 col-span-2">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Recebida em
          </div>
          <div className="font-medium">{new Date(d.data).toLocaleString("pt-BR")}</div>
        </div>
      </div>

      {/* Mapa */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-primary" /> Localização da ocorrência
        </h4>
        <DenunciaDetailMap lat={d.lat} lng={d.lng} titulo={d.titulo} height={220} />
      </div>

      {/* Evidências */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <ImageIcon className="h-4 w-4 text-primary" /> Evidências
          <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
            {midias.length}
          </span>
        </h4>
        {midias.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
            Nenhuma evidência anexada.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {midias.map((m, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setZoom(m.url)}
                className="group relative aspect-square overflow-hidden rounded-lg border bg-muted hover:ring-2 hover:ring-accent transition"
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

      {/* Timeline */}
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

      <Dialog open={!!zoom} onOpenChange={(o) => !o && setZoom(null)}>
        <DialogContent className="max-w-3xl p-2 bg-background">
          {zoom && <img src={zoom} alt="Evidência ampliada" className="w-full h-auto rounded-md" />}
        </DialogContent>
      </Dialog>
    </>
  );
}
