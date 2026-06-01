import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { denuncias as initialDenuncias } from "@/data/denuncias";
import type { Denuncia } from "@/types/denuncia";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DetalhesDenuncia } from "@/features/cidadao/components/DetalhesDenuncia";
import { NovaDenunciaDialog } from "@/features/cidadao/components/NovaDenunciaDialog";
import { Plus, Search } from "lucide-react";

export function CidadaoPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Denuncia[]>(() => initialDenuncias.filter((_, i) => i < 8));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Denuncia | null>(null);
  const [openNew, setOpenNew] = useState(false);

  const filtered = useMemo(
    () =>
      items.filter((d) => {
        const okS = statusFilter === "all" || d.status === statusFilter;
        const okQ =
          !search ||
          d.titulo.toLowerCase().includes(search.toLowerCase()) ||
          d.protocolo.toLowerCase().includes(search.toLowerCase());
        return okS && okQ;
      }),
    [items, search, statusFilter],
  );

  return (
    <main className="mx-auto max-w-[1400px] px-4 sm:px-6 py-8">
      <section className="mb-8 rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.35_0.13_258)] p-8 text-primary-foreground shadow-card relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative">
          <div className="text-sm opacity-80">Olá, {user?.nome}</div>
          <h1 className="mt-1 text-3xl font-bold">Painel do Cidadão</h1>
          <p className="mt-2 max-w-xl text-primary-foreground/85">
            Acompanhe suas denúncias em tempo real e abra novas solicitações com triagem automática
            por IA.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Dialog open={openNew} onOpenChange={setOpenNew}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Plus className="h-4 w-4" /> Nova Denúncia
                </Button>
              </DialogTrigger>
              <NovaDenunciaDialog
                onClose={() => setOpenNew(false)}
                onCreate={(d) => setItems((prev) => [d, ...prev])}
              />
            </Dialog>
          </div>
        </div>
      </section>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total de denúncias", value: items.length, color: "text-primary" },
          {
            label: "Em andamento",
            value: items.filter((d) => d.status !== "Resolvido" && d.status !== "Pendente").length,
            color: "text-accent",
          },
          {
            label: "Resolvidas",
            value: items.filter((d) => d.status === "Resolvido").length,
            color: "text-success",
          },
        ].map((k) => (
          <Card key={k.label} className="p-5 shadow-soft border-0">
            <div className="text-sm text-muted-foreground">{k.label}</div>
            <div className={`mt-1 text-3xl font-bold ${k.color}`}>{k.value}</div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden border-0 shadow-card">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Histórico de denúncias</h2>
            <p className="text-sm text-muted-foreground">
              Clique em uma linha para ver os detalhes.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar título ou protocolo..."
                className="pl-9 sm:w-72"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
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
                <tr
                  key={d.id}
                  className="border-t cursor-pointer hover:bg-muted/40"
                  onClick={() => setSelected(d)}
                >
                  <td className="px-4 py-3 font-mono text-xs text-primary">{d.protocolo}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{d.titulo}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.categoria}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(d.data).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={d.status} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    Nenhuma denúncia encontrada.
                  </td>
                </tr>
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
