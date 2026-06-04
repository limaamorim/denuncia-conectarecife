import { categorias, denuncias } from "@/data/denuncias";
import type { Denuncia } from "@/types/denuncia";

function seeded(i: number) {
  return ((i * 9301 + 49297) % 233280) / 233280;
}

export const kpis = (items: Denuncia[] = denuncias) => {
  const total = items.length;
  const pendentes = items.filter((d) => d.status === "Pendente").length;
  const andamento = items.filter(
    (d) => d.status === "Em Andamento" || d.status === "Em Triagem",
  ).length;
  const resolvidas = items.filter((d) => d.status === "Resolvido").length;

  return { total, pendentes, andamento, resolvidas, tempoMedio: 4.2 };
};

export const porCategoria = (items: Denuncia[] = denuncias) => {
  // Inclui apenas categorias com pelo menos 1 ocorrência para evitar gráfico vazio
  const all = Array.from(new Set([...categorias, ...items.map((d) => d.categoria)]));
  return all
    .map((c) => ({ name: c, value: items.filter((d) => d.categoria === c).length }))
    .filter((x) => x.value > 0);
};

export const recebidasVsResolvidas = (items: Denuncia[] = denuncias) => {
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
  // Distribui pelos meses proporcionalmente ao total para "reagir" aos filtros
  const total = items.length || 1;
  const escala = total / 48;
  return meses.map((m, i) => ({
    mes: m,
    recebidas: Math.max(1, Math.floor((30 + Math.floor(seeded(i + 1) * 40)) * escala)),
    resolvidas: Math.max(0, Math.floor((20 + Math.floor(seeded(i + 5) * 35)) * escala)),
  }));
};
