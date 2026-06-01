import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { MockMap } from "@/components/MockMap";
import { denuncias, kpis, porCategoria, recebidasVsResolvidas } from "@/lib/mock-data";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";
import { LayoutDashboard, ListChecks, Settings, FileBarChart, Calendar, MapPin, Sparkles, Check, ArrowRightLeft, TrendingUp, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({ meta: [{ title: "Dashboard Admin — Conecta Recife" }] }),
  component: AdminPage,
});

const COLORS = ["oklch(0.42 0.14 255)", "oklch(0.68 0.155 232)", "oklch(0.68 0.16 152)", "oklch(0.82 0.16 85)", "oklch(0.6 0.18 30)"];

function AdminPage() {
  const { user } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [view, setView] = useState<"overview" | "triagem" | "config">("overview");
  const k = kpis();

  if (user?.role !== "admin") {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-xl font-bold">Acesso restrito</h2>
        <p className="mt-2 text-muted-foreground">Esta área é exclusiva para gestores municipais.</p>
        <Link to="/cidadao"><Button className="mt-6">Ir para o painel do cidadão</Button></Link>
      </main>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 px-4 sm:px-6 py-8">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Card className="p-2 border-0 shadow-soft">
          <nav className="flex lg:flex-col gap-1">
            <SidebarBtn icon={<LayoutDashboard className="h-4 w-4" />} active={view === "overview"} onClick={() => setView("overview")}>Visão Geral</SidebarBtn>
            <SidebarBtn icon={<ListChecks className="h-4 w-4" />} active={view === "triagem"} onClick={() => setView("triagem")}>Fila de Triagem</SidebarBtn>
            <SidebarBtn icon={<Settings className="h-4 w-4" />} active={view === "config"} onClick={() => setView("config")}>Configurações</SidebarBtn>
          </nav>
        </Card>
        <div className="hidden lg:block mt-4 rounded-xl bg-primary p-4 text-primary-foreground">
          <FileBarChart className="h-5 w-5" />
          <div className="mt-2 text-sm font-semibold">Relatório mensal</div>
          <div className="text-xs text-primary-foreground/80">Exporte indicadores em PDF.</div>
          <Button size="sm" variant="secondary" className="mt-3 w-full">Gerar relatório</Button>
        </div>
      </aside>

      <div className="space-y-6 min-w-0">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-sm text-muted-foreground">Dashboard administrativo</div>
            <h1 className="text-2xl font-bold text-foreground">{view === "overview" ? "Visão Geral" : view === "triagem" ? "Fila de Triagem com IA" : "Configurações"}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm"><Calendar className="h-4 w-4" /> Últimos 30 dias</Button>
            <Select defaultValue="all">
              <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Bairro" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os bairros</SelectItem>
                {["Boa Viagem", "Casa Forte", "Pina", "Madalena", "Afogados", "Encruzilhada"].map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {view === "overview" && (
          <>
            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KPI title="Total de Casos" value={k.total} delta="+12% vs. mês anterior" icon={<FileBarChart className="h-5 w-5" />} tone="primary" />
              <KPI title="Denúncias Pendentes" value={k.pendentes} delta="Necessitam triagem" icon={<AlertCircle className="h-5 w-5" />} tone="warning" />
              <KPI title="Casos em Andamento" value={k.andamento} delta="Sendo atendidos" icon={<Clock className="h-5 w-5" />} tone="accent" />
              <KPI title="Tempo Médio de Resolução" value={`${k.tempoMedio} dias`} delta="−0.8 dias" icon={<TrendingUp className="h-5 w-5" />} tone="success" />
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="p-5 border-0 shadow-card lg:col-span-1">
                <h3 className="text-sm font-semibold text-foreground">Denúncias por categoria</h3>
                <p className="text-xs text-muted-foreground mb-3">Distribuição atual</p>
                <div className="h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={porCategoria()} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                        {porCategoria().map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="p-5 border-0 shadow-card lg:col-span-2">
                <h3 className="text-sm font-semibold text-foreground">Recebidas vs. Resolvidas</h3>
                <p className="text-xs text-muted-foreground mb-3">Volume mensal</p>
                <div className="h-64">
                  <ResponsiveContainer>
                    <AreaChart data={recebidasVsResolvidas()}>
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.42 0.14 255)" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="oklch(0.42 0.14 255)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.68 0.16 152)" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="oklch(0.68 0.16 152)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 256)" />
                      <XAxis dataKey="mes" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Area type="monotone" dataKey="recebidas" stroke="oklch(0.42 0.14 255)" fill="url(#g1)" strokeWidth={2} />
                      <Area type="monotone" dataKey="resolvidas" stroke="oklch(0.68 0.16 152)" fill="url(#g2)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Map */}
            <Card className="p-5 border-0 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5"><MapPin className="h-4 w-4 text-accent" /> Mapa Inteligente</h3>
                  <p className="text-xs text-muted-foreground">Cluster e heatmap de incidências urbanas</p>
                </div>
              </div>
              <MockMap height={420} />
            </Card>
          </>
        )}

        {view === "triagem" && <FilaTriagem />}

        {view === "config" && (
          <Card className="p-8 border-0 shadow-card text-center text-muted-foreground">
            <Settings className="mx-auto h-10 w-10 mb-3 text-muted-foreground" />
            Configurações da plataforma — em breve.
          </Card>
        )}
      </div>
    </div>
  );
}

function SidebarBtn({ icon, children, active, onClick }: { icon: ReactNode; children: ReactNode; active?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition w-full text-left ${active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}>
      {icon}{children}
    </button>
  );
}

function KPI({ title, value, delta, icon, tone }: { title: string; value: string | number; delta: string; icon: ReactNode; tone: "primary" | "accent" | "success" | "warning" }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-accent",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-[oklch(0.45_0.1_70)]",
  };
  return (
    <Card className="p-5 border-0 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</div>
          <div className="mt-2 text-3xl font-bold text-foreground">{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{delta}</div>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tones[tone]}`}>{icon}</div>
      </div>
    </Card>
  );
}

function FilaTriagem() {
  const [rows, setRows] = useState(() => denuncias.slice(0, 14));
  const aprovar = (id: string) => {
    setRows((r) => r.filter((x) => x.id !== id));
    toast.success("Denúncia aprovada e despachada ao órgão.");
  };
  const alterar = (id: string) => {
    toast.info("Abrir destino alternativo para " + id);
  };
  return (
    <Card className="overflow-hidden border-0 shadow-card">
      <div className="border-b p-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-accent" /> Fila de triagem assistida por IA</h3>
        <p className="text-xs text-muted-foreground">Revise as sugestões de categoria e aprove o despacho.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Título</th>
              <th className="px-4 py-3 text-left">Categoria sugerida</th>
              <th className="px-4 py-3 text-left">Confiança</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs text-primary">{d.protocolo}</td>
                <td className="px-4 py-3 font-medium text-foreground max-w-[260px] truncate">{d.titulo}</td>
                <td className="px-4 py-3">
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent border border-accent/30">
                    <Sparkles className="h-3 w-3" /> {d.iaSugestao}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent to-primary" style={{ width: `${d.iaConfianca}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{d.iaConfianca}%</span>
                  </div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground h-8" onClick={() => aprovar(d.id)}>
                      <Check className="h-3.5 w-3.5" /> Aprovar
                    </Button>
                    <Button size="sm" variant="outline" className="h-8" onClick={() => alterar(d.id)}>
                      <ArrowRightLeft className="h-3.5 w-3.5" /> Alterar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
