import { useState } from "react";
import type { Denuncia } from "@/types/denuncia";
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
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

export function NovaDenunciaDialog({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (d: Denuncia) => void;
}) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [localizacao, setLocalizacao] = useState<LocalizacaoCompleta | null>(null);

  const submit = () => {
    if (!titulo) {
      toast.error("Informe um título");
      return;
    }

    const lat = localizacao?.lat ?? -8.05;
    const lng = localizacao?.lng ?? -34.9;

    const d: Denuncia = {
      id: `new-${Date.now()}`,
      protocolo: `REC-${Date.now().toString().slice(-7)}`,
      titulo,
      descricao,
      categoria: "Iluminação",
      status: "Pendente",
      bairro: localizacao?.bairro || "Boa Viagem",
      data: new Date().toISOString(),
      lat,
      lng,
      iaConfianca: 91,
      iaSugestao: "Iluminação",
      cidadao: "voce@recife.gov",
      timeline: [
        { label: "Recebido", date: new Date().toISOString(), done: true },
        { label: "Analisado por IA", date: new Date().toISOString(), done: false },
        { label: "Encaminhado ao órgão", date: new Date().toISOString(), done: false },
        { label: "Em andamento", date: new Date().toISOString(), done: false },
      ],
    };

    onCreate(d);
    toast.success("Denúncia registrada! Protocolo " + d.protocolo);
    onClose();
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Nova denúncia</DialogTitle>
        <DialogDescription>
          Descreva o problema. Nossa IA classificará a categoria automaticamente.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Título</Label>
          <Input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex.: Poste sem luz na rua X"
          />
        </div>
        <div className="space-y-2">
          <Label>Descrição</Label>
          <Textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
            placeholder="Detalhe o problema..."
          />
        </div>

        <div className="space-y-4 rounded-xl border bg-muted/15 p-4">
          <div>
            <Label className="text-sm font-medium">Localização e evidências</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              Marque o ponto no mapa e envie fotos do local.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <DenunciaLocationMap height={320} onLocationPicked={(loc) => setLocalizacao(loc)} />
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Fotos do local</Label>
                <MediaUpload value={media} onChange={setMedia} />
                <p className="text-xs text-muted-foreground">Você pode adicionar várias imagens.</p>
              </div>

              {localizacao && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Endereço detectado</Label>
                  <div className="grid gap-2">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Endereço</div>
                      <Input readOnly value={localizacao.enderecoCompleto} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Bairro</div>
                        <Input readOnly value={localizacao.bairro} />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">CEP</div>
                        <Input readOnly value={localizacao.cep ?? ""} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Cidade</div>
                        <Input readOnly value={localizacao.cidade} />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Estado</div>
                        <Input readOnly value={localizacao.estado} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-accent/10 border border-accent/30 p-3 text-xs text-foreground">
          <Sparkles className="h-4 w-4 text-accent mt-0.5 shrink-0" />
          <span>
            Nossa IA analisará sua foto e título para classificar categoria e prioridade
            automaticamente, otimizando o tempo de resposta.
          </span>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={submit}>
            Enviar denúncia
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
