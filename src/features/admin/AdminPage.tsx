import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { denuncias as allDenuncias } from "@/data/denuncias";
import { kpis, porCategoria, recebidasVsResolvidas } from "@/features/admin/data/stats";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminKPI } from "@/features/admin/components/AdminKPI";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { FilaTriagem } from "@/features/admin/components/FilaTriagem";
import { AdminRealMap } from "@/features/admin/components/AdminRealMap";
import { AdminDenunciaDetail } from "@/features/admin/components/AdminDenunciaDetail";
import { DateRangeFilter } from "@/features/admin/components/DateRangeFilter";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { Denuncia } from "@/types/denuncia";
import type { DateRange } from "react-day-picker";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  FileBarChart,
  MapPin,
  TrendingUp,
  Clock,
  AlertCircle,
  Settings,
  Filter,
  CheckCircle2,
} from "lucide-react";

const COLORS = [
  "oklch(0.42 0.14 255)",
  "oklch(0.68 0.155 232)",
  "oklch(0.68 0.16 152)",
  "oklch(0.82 0.16 85)",
  "oklch(0.6 0.18 30)",
  "oklch(0.55 0.18 320)",
  "oklch(0.6 0.15 200)",
];

const URGENCIAS = ["all", "Alta", "Média", "Baixa"] as const;
const BAIRROS = [
  "Boa Viagem",
  "Casa Forte",
  "Espinheiro",
  "Pina",
  "Várzea",
  "Madalena",
  "Afogados",
  "Encruzilhada",
  "Torre",
  "Cordeiro",
];

export function AdminPage() {
  const { user } = useAuth();
  const [view, setView] = useState<"overview" | "triagem" | "config">("overview");

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [urgencia, setUrgencia] = useState<string>("all");
  const [categoria, setCategoria] = useState<string>("all");
  const [bairro, setBairro] = useState<string>("all");
  const [selected, setSelected] = useState<Denuncia | null>(null);

  const categoriasUnicas = useMemo(
    () => Array.from(new Set(allDenuncias.map((d) => d.categoria))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    return allDenuncias.filter((d) => {
      if (urgencia !== "all" && d.iaUrgencia !== urgencia) return false;
      if (categoria !== "all" && d.categoria !== categoria) return false;
      if (bairro !== "all" && d.bairro !== bairro) return false;
      if (dateRange?.from) {
        const dt = new Date(d.data).getTime();
        const from = new Date(dateRange.from);
        from.setHours(0, 0, 0, 0);
        if (dt < from.getTime()) return false;
        if (dateRange.to) {
          const to = new Date(dateRange.to);
          to.setHours(23, 59, 59, 999);
          if (dt > to.getTime()) return false;
        }
      }
      return true;
    });
  }, [dateRange, urgencia, categoria, bairro]);

  const k = kpis(filtered);

  const resetFilters = () => {
    setDateRange(undefined);
    setUrgencia("all");
    setCategoria("all");
    setBairro("all");
  };

  const hasFilters =
    !!dateRange || urgencia !== "all" || categoria !== "all" || bairro !== "all";

  if (user?.role !== "admin") {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-xl font-bold">Acesso restrito</h2>
        <p className="mt-2 text-muted-foreground">
          Esta área é exclusiva para gestores municipais.
        </p>
        <Link to="/cidadao">
          <Button className="mt-6">Ir para o painel do cidadão</Button>
        </Link>
      </main>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 px-4 sm:px-6 py-8">
      <AdminSidebar view={view} onViewChange={setView} />

      <div className="space-y-6 min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-sm text-muted-foreground">Dashboard administrativo</div>
            <h1 className="text-2xl font-bold text-foreground">
              {view === "overview"
                ? "Visão Geral"
                : view === "triagem"
                  ? "Fila de Triagem com IA"
                  : "Configurações"}
            </h1>
          </div>
        </div>

        {view === "overview" && (
          <Card className="p-3 sm:p-4 border-0 shadow-soft">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mr-1">
                <Filter className="h-3.5 w-3.5" /> Filtros
              </div>

              <DateRangeFilter value={dateRange} onChange={setDateRange} />

              <Select value={urgencia} onValueChange={setUrgencia}>
                <SelectTrigger className="h-9 w-36">
                  <SelectValue placeholder="Urgência" />
                </SelectTrigger>
                <SelectContent>
                  {URGENCIAS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u === "all" ? "Todas urgências" : u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger className="h-9 w-44">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas categorias</SelectItem>
                  {categoriasUnicas.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={bairro} onValueChange={setBairro}>
                <SelectTrigger className="h-9 w-44">
                  <SelectValue placeholder="Bairro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os bairros</SelectItem>
                  {BAIRROS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs">
                  Limpar
                </Button>
              )}

              <div className="ml-auto text-xs text-muted-foreground">
                {filtered.length} de {allDenuncias.length} denúncias
              </div>
            </div>
          </Card>
        )}

        {view === "overview" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <AdminKPI
                title="Total de Casos"
                value={k.total}
                delta={`${filtered.length} no filtro atual`}
                icon={<FileBarChart className="h-5 w-5" />}
                tone="primary"
              />
              <AdminKPI
                title="Pendentes"
                value={k.pendentes}
                delta="Necessitam triagem"
                icon={<AlertCircle className="h-5 w-5" />}
                tone="warning"
              />
              <AdminKPI
                title="Em Andamento"
                value={k.andamento}
                delta="Sendo atendidos"
                icon={<Clock className="h-5 w-5" />}
                tone="accent"
              />
              <AdminKPI
                title="Resolvidos"
                value={k.resolvidas}
                delta="Concluídos no período"
                icon={<CheckCircle2 className="h-5 w-5" />}
                tone="success"
              />
              <AdminKPI
                title="Tempo Médio"
                value={`${k.tempoMedio} dias`}
                delta="−0.8 dias"
                icon={<TrendingUp className="h-5 w-5" />}
                tone="primary"
              />
            </div>


            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="p-5 border-0 shadow-card lg:col-span-1">
                <h3 className="text-sm font-semibold text-foreground">Denúncias por categoria</h3>
                <p className="text-xs text-muted-foreground mb-3">Distribuição atual</p>
                <div className="h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={porCategoria(filtered)}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={85}
                        paddingAngle={2}
                      >
                        {porCategoria(filtered).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
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
                    <AreaChart data={recebidasVsResolvidas(filtered)}>
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
                      <Area
                        type="monotone"
                        dataKey="recebidas"
                        stroke="oklch(0.42 0.14 255)"
                        fill="url(#g1)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="resolvidas"
                        stroke="oklch(0.68 0.16 152)"
                        fill="url(#g2)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <Card className="p-5 border-0 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-accent" /> Mapa Inteligente — Recife
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Coordenadas reais (OpenStreetMap) · clusters, heatmap e popups
                  </p>
                </div>
              </div>
              <AdminRealMap height={460} items={filtered} onSelect={setSelected} />
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

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selected && <AdminDenunciaDetail d={selected} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}
