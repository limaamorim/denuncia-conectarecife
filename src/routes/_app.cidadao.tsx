import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { denuncias as initialDenuncias, type Denuncia, type Status } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { MockMap } from "@/components/MockMap";
import { Plus, Search, MapPin, Upload, CheckCircle2, Circle, FileText, Image as ImageIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/cidadao")({
  head: () => ({ meta: [{ title: "Painel do Cidadão — Conecta Recife" }] }),
  component: CidadaoPage,
});

function CidadaoPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Denuncia[]>(() => initialDenuncias.filter((_, i) => i < 8));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Denuncia | null>(null);
  const [openNew, setOpenNew] = useState(false);

  const filtered = useMemo(() => items.filter((d) => {
    const okS = statusFilter === "all" || d.status === statusFilter;
    const okQ = !search || d.titulo.toLowerCase().includes(search.toLowerCase()) || d.protocolo.toLowerCase().includes(search.toLowerCase());
    return okS && okQ;
  }), [items, search, statusFilter]);

  return (
    <main className="mx-auto max-w-[1400px] px-4 sm:px-6 py-8">
      {/* Hero */}
      <section className="mb-8 rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.35_0.13_258)] p-8 text-primary-foreground shadow-card relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative">
          <div className="text-sm opacity-80">Olá, {user?.nome}</div>
          <h1 className="mt-1 text-3xl font-bold">Painel do Cidadão</h1>
          <p className="mt-2 max-w-xl text-primary-foreground/85">Acompanhe suas denúncias em tempo real e abra novas solicitações com triagem automática por IA.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Dialog open={openNew} onOpenChange={setOpenNew}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Plus className="h-4 w-4" /> Nova Denúncia
                </Button>
              </DialogTrigger>
              <NovaDenunciaDialog onClose={() => setOpenNew(false)} onCreate={(d) => setItems((prev) => [d, ...prev])} />
            </Dialog>
          </div>
        </div>
      </section>

      {/* KPI mini */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {([
          { label: "Total de denúncias", value: items.length, color: "text-primary" },
          { label: "Em andamento", value: items.filter((d) => d.status !== "Resolvido" && d.status !== "Pendente").length, color: "text-accent" },
          { label: "Resolvidas", value: items.filter((d) => d.status === "Resolvido").length, color: "text-success" },
        ]).map((k) => (
          <Card key={k.label} className="p-5 shadow-soft border-0">
            <div className="text-sm text-muted-foreground">{k.label}</div>
            <div className={`mt-1 text-3xl font-bold ${k.color}`}>{k.value}</div>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden border-0 shadow-card">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Histórico de denúncias</h2>
            <p className="text-sm text-muted-foreground">Clique em uma linha para ver os detalhes.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar título ou protocolo..." className="pl-9 sm:w-72" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="sm:w-48"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Em Triagem">Em Triagem</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Resolvido">Resolvido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Protocolo</th>
                <th className="px-4 py-3 text-left">Título</th>
                <th className="px-4 py-3 text-left">Categoria</th>
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-t cursor-pointer hover:bg-muted/40" onClick={() => setSelected(d)}>
                  <td className="px-4 py-3 font-mono text-xs text-primary">{d.protocolo}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{d.titulo}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.categoria}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(d.data).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">Nenhuma denúncia encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && <DetalhesDenuncia d={selected} />}
        </SheetContent>
      </Sheet>
    </main>
  );
}

function DetalhesDenuncia({ d }: { d: Denuncia }) {
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
          <div className="text-xs text-muted-foreground flex items-center gap-1"><Sparkles className="h-3 w-3" /> Sugestão da IA</div>
          <div className="font-medium">{d.iaSugestao} — {d.iaConfianca}% confiança</div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-foreground mb-3">Linha do tempo</h4>
        <ol className="relative space-y-4 border-l-2 border-border pl-5">
          {d.timeline.map((t, i) => (
            <li key={i} className="relative">
              <span className={`absolute -left-[27px] flex h-5 w-5 items-center justify-center rounded-full ${t.done ? "bg-success text-success-foreground" : "bg-muted border"}`}>
                {t.done ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3 text-muted-foreground" />}
              </span>
              <div className="text-sm font-medium text-foreground">{t.label}</div>
              <div className="text-xs text-muted-foreground">{new Date(t.date).toLocaleString("pt-BR")}</div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

function NovaDenunciaDialog({ onClose, onCreate }: { onClose: () => void; onCreate: (d: Denuncia) => void }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [pin, setPin] = useState<{ x: number; y: number } | null>(null);

  const handleFile = (f?: File | null) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const submit = () => {
    if (!titulo) { toast.error("Informe um título"); return; }
    const d: Denuncia = {
      id: `new-${Date.now()}`,
      protocolo: `REC-${Date.now().toString().slice(-7)}`,
      titulo, descricao,
      categoria: "Iluminação",
      status: "Pendente",
      bairro: "Boa Viagem",
      data: new Date().toISOString(),
      lat: -8.05, lng: -34.9,
      iaConfianca: 91, iaSugestao: "Iluminação",
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
        <DialogDescription>Descreva o problema. Nossa IA classificará a categoria automaticamente.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Título</Label>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Poste sem luz na rua X" />
        </div>
        <div className="space-y-2">
          <Label>Descrição</Label>
          <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={4} placeholder="Detalhe o problema..." />
        </div>
        <div className="space-y-2">
          <Label>Foto do local</Label>
          <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 cursor-pointer hover:border-accent transition">
            {preview ? (
              <img src={preview} alt="preview" className="max-h-48 rounded-lg" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Arraste uma imagem ou clique para selecionar</div>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
          </label>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Localização (clique no mapa)</Label>
          <div className="relative cursor-crosshair" onClick={(e) => {
            const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            setPin({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}>
            <MockMap height={220} />
            {pin && (
              <div className="absolute pointer-events-none" style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%,-100%)" }}>
                <MapPin className="h-7 w-7 text-destructive drop-shadow" fill="currentColor" />
              </div>
            )}
          </div>
          {pin && <div className="text-xs text-muted-foreground">Endereço aproximado: Av. Boa Viagem, Recife — PE</div>}
        </div>
        <div className="flex items-start gap-2 rounded-lg bg-accent/10 border border-accent/30 p-3 text-xs text-foreground">
          <Sparkles className="h-4 w-4 text-accent mt-0.5 shrink-0" />
          <span>Nossa IA analisará sua foto e título para classificar categoria e prioridade automaticamente, otimizando o tempo de resposta.</span>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={submit}>Enviar denúncia</Button>
        </div>
      </div>
    </DialogContent>
  );
}
