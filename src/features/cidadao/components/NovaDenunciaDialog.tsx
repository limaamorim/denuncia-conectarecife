import { useMemo, useState } from "react";
import type { Category, Denuncia, Urgencia } from "@/types/denuncia";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  DenunciaLocationMap,
  type LocalizacaoCompleta,
} from "@/features/cidadao/components/DenunciaLocationMap";
import { MediaUpload } from "@/features/cidadao/components/MediaUpload";
import { Stepper, type StepKey, STEPS } from "@/features/cidadao/components/wizard/Stepper";
import { CategoryStep, CATEGORIES } from "@/features/cidadao/components/wizard/CategoryStep";
import { TitleSuggestions } from "@/features/cidadao/components/wizard/TitleSuggestions";
import { VoiceInput } from "@/features/cidadao/components/wizard/VoiceInput";
import { AnalysisModal } from "@/features/cidadao/components/wizard/AnalysisModal";
import { ArrowLeft, ArrowRight, ImageIcon, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { urgenciaColorClasses } from "@/lib/urgencia";

export function NovaDenunciaDialog({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (d: Denuncia) => void;
}) {
  const [step, setStep] = useState<StepKey>("categoria");
  const [categoria, setCategoria] = useState<Category | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [localizacao, setLocalizacao] = useState<LocalizacaoCompleta | null>(null);

  const stepIdx = STEPS.findIndex((s) => s.key === step);
  const goTo = (k: StepKey) => setStep(k);
  const next = () => {
    const n = STEPS[stepIdx + 1];
    if (n) setStep(n.key);
  };
  const prev = () => {
    const p = STEPS[stepIdx - 1];
    if (p) setStep(p.key);
  };

  const canAdvance = useMemo(() => {
    switch (step) {
      case "categoria":
        return !!categoria;
      case "info":
        return titulo.trim().length > 2;
      case "localizacao":
        return !!localizacao;
      case "evidencias":
        return true;
      case "revisao":
        return true;
      default:
        return true;
    }
  }, [step, categoria, titulo, localizacao]);

  const handleAnalysisDone = (r: { urgencia: Urgencia; motivo: string; confianca: number }) => {
    const lat = localizacao?.lat ?? -8.05;
    const lng = localizacao?.lng ?? -34.9;
    const d: Denuncia = {
      id: `new-${Date.now()}`,
      protocolo: `REC-${Date.now().toString().slice(-7)}`,
      titulo,
      descricao,
      categoria: categoria!,
      status: "Pendente",
      bairro: localizacao?.bairro || "Boa Viagem",
      data: new Date().toISOString(),
      lat,
      lng,
      iaConfianca: r.confianca,
      iaSugestao: categoria!,
      iaUrgencia: r.urgencia,
      iaUrgenciaMotivo: r.motivo,
      endereco: localizacao?.enderecoCompleto,
      cidade: localizacao?.cidade,
      estado: localizacao?.estado,
      cep: localizacao?.cep,
      cidadao: "voce@recife.gov",
      timeline: [
        { label: "Recebido", date: new Date().toISOString(), done: true },
        { label: "Analisado por IA", date: new Date().toISOString(), done: true },
        { label: "Encaminhado ao órgão", date: new Date().toISOString(), done: false },
        { label: "Em andamento", date: new Date().toISOString(), done: false },
      ],
    };
    onCreate(d);
    toast.success(`Denúncia ${d.protocolo} registrada • Urgência ${r.urgencia}`);
    onClose();
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Nova denúncia</DialogTitle>
        <DialogDescription>
          Siga as etapas para registrar sua ocorrência com classificação automática por IA.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-2">
        <Stepper current={step} />
      </div>

      <div className="mt-5 min-h-[280px]">
        {step === "categoria" && (
          <CategoryStep selected={categoria} onSelect={(c) => { setCategoria(c); setTimeout(next, 180); }} />
        )}

        {step === "info" && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex.: Poste sem luz na rua X"
              />
              <TitleSuggestions categoria={categoria} onPick={(s) => setTitulo(s)} />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <div className="flex gap-2 items-start">
                <Textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={5}
                  placeholder="Detalhe o problema ou use o microfone para ditar..."
                  className="flex-1"
                />
                <VoiceInput
                  onTranscript={(text) =>
                    setDescricao((prev) => (prev ? prev.trim() + " " + text : text))
                  }
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Reconhecimento de voz em português (pt-BR). Funciona melhor no Chrome.
              </p>
            </div>
          </div>
        )}

        {step === "localizacao" && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-accent" />
              <span className="font-medium">Marque o local da ocorrência</span>
            </div>
            <DenunciaLocationMap height={340} onLocationPicked={setLocalizacao} />
            {localizacao && (
              <div className="grid gap-2 rounded-lg border bg-muted/20 p-3 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">Endereço: </span>
                  <span className="font-medium">{localizacao.enderecoCompleto}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Bairro</div>
                    <Input
                      value={localizacao.bairro}
                      onChange={(e) =>
                        setLocalizacao({ ...localizacao, bairro: e.target.value })
                      }
                      className="h-8"
                    />
                  </div>
                  <div>
                    <div className="text-muted-foreground">CEP</div>
                    <Input
                      value={localizacao.cep ?? ""}
                      onChange={(e) => setLocalizacao({ ...localizacao, cep: e.target.value })}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <div className="text-muted-foreground">Cidade</div>
                    <Input
                      value={localizacao.cidade}
                      onChange={(e) =>
                        setLocalizacao({ ...localizacao, cidade: e.target.value })
                      }
                      className="h-8"
                    />
                  </div>
                  <div>
                    <div className="text-muted-foreground">Estado</div>
                    <Input
                      value={localizacao.estado}
                      onChange={(e) =>
                        setLocalizacao({ ...localizacao, estado: e.target.value })
                      }
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === "evidencias" && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-sm">
              <ImageIcon className="h-4 w-4 text-accent" />
              <span className="font-medium">Anexe fotos do local (opcional)</span>
            </div>
            <MediaUpload value={media} onChange={setMedia} />
          </div>
        )}

        {step === "revisao" && (
          <div className="space-y-3 animate-fade-in">
            <h3 className="text-base font-semibold">Revisão</h3>
            <p className="text-sm text-muted-foreground">
              Confira os dados antes de enviar. Você pode voltar para editar qualquer etapa.
            </p>
            <div className="grid gap-2 text-sm">
              <ReviewRow label="Categoria" value={categoria ?? "—"} onEdit={() => goTo("categoria")} />
              <ReviewRow label="Título" value={titulo || "—"} onEdit={() => goTo("info")} />
              <ReviewRow
                label="Descrição"
                value={descricao || "(sem descrição)"}
                onEdit={() => goTo("info")}
              />
              <ReviewRow
                label="Localização"
                value={localizacao?.enderecoCompleto ?? "Não definida"}
                onEdit={() => goTo("localizacao")}
              />
              <ReviewRow
                label="Evidências"
                value={media.length ? `${media.length} arquivo(s) anexado(s)` : "Nenhuma"}
                onEdit={() => goTo("evidencias")}
              />
            </div>
            {media.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {media.slice(0, 8).map((f, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(f)}
                    alt={f.name}
                    className="h-16 w-full rounded-md object-cover border"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {step === "envio" && categoria && (
          <AnalysisModal categoria={categoria} onComplete={handleAnalysisDone} />
        )}
      </div>

      {step !== "envio" && (
        <div className="mt-6 flex items-center justify-between gap-2 border-t pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <div className="flex gap-2">
            {stepIdx > 0 && (
              <Button variant="outline" onClick={prev}>
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
            )}
            {step === "revisao" ? (
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => setStep("envio")}
              >
                <Send className="h-4 w-4" /> Enviar denúncia
              </Button>
            ) : (
              <Button
                className="bg-primary hover:bg-primary/90"
                disabled={!canAdvance}
                onClick={next}
              >
                Avançar <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </DialogContent>
  );
}

function ReviewRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border bg-card p-3">
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium text-foreground break-words">{value}</div>
      </div>
      <Button variant="ghost" size="sm" className="text-accent" onClick={onEdit}>
        Editar
      </Button>
    </div>
  );
}

// Re-export para evitar tree-shake de constantes usadas
export { CATEGORIES, urgenciaColorClasses };
