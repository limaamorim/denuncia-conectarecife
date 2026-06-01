import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
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
import { MockMap } from "@/features/admin/components/MockMap";
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
  Calendar,
  MapPin,
  TrendingUp,
  Clock,
  AlertCircle,
  Settings,
} from "lucide-react";

const COLORS = [
  "oklch(0.42 0.14 255)",
  "oklch(0.68 0.155 232)",
  "oklch(0.68 0.16 152)",
  "oklch(0.82 0.16 85)",
  "oklch(0.6 0.18 30)",
];

export function AdminPage() {
  const { user } = useAuth();
  const [view, setView] = useState<"overview" | "triagem" | "config">("overview");
  const k = kpis();

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
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4" /> Últimos 30 dias
            </Button>
            <Select defaultValue="all">
              <SelectTrigger className="h-9 w-44">
                <SelectValue placeholder="Bairro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os bairros</SelectItem>
                {["Boa Viagem", "Casa Forte", "Pina", "Madalena", "Afogados", "Encruzilhada"].map(
                  (b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {view === "overview" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <AdminKPI
                title="Total de Casos"
                value={k.total}
                delta="+12% vs. mês anterior"
                icon={<FileBarChart className="h-5 w-5" />}
                tone="primary"
              />
              <AdminKPI
                title="Denúncias Pendentes"
                value={k.pendentes}
                delta="Necessitam triagem"
                icon={<AlertCircle className="h-5 w-5" />}
                tone="warning"
              />
              <AdminKPI
                title="Casos em Andamento"
                value={k.andamento}
                delta="Sendo atendidos"
                icon={<Clock className="h-5 w-5" />}
                tone="accent"
              />
              <AdminKPI
                title="Tempo Médio de Resolução"
                value={`${k.tempoMedio} dias`}
                delta="−0.8 dias"
                icon={<TrendingUp className="h-5 w-5" />}
                tone="success"
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
                        data={porCategoria()}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={85}
                        paddingAngle={2}
                      >
                        {porCategoria().map((_, i) => (
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
                    <MapPin className="h-4 w-4 text-accent" /> Mapa Inteligente
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Cluster e heatmap de incidências urbanas
                  </p>
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
