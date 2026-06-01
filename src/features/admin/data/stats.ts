import { categorias, denuncias } from "@/data/denuncias";

function seeded(i: number) {
  return ((i * 9301 + 49297) % 233280) / 233280;
}

export const kpis = () => {
  const total = denuncias.length;
  const pendentes = denuncias.filter((d) => d.status === "Pendente").length;
  const andamento = denuncias.filter(
    (d) => d.status === "Em Andamento" || d.status === "Em Triagem",
  ).length;
  const resolvidas = denuncias.filter((d) => d.status === "Resolvido").length;

  return { total, pendentes, andamento, resolvidas, tempoMedio: 4.2 };
};

export const porCategoria = () =>
  categorias.map((c) => ({ name: c, value: denuncias.filter((d) => d.categoria === c).length }));

export const recebidasVsResolvidas = () => {
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

  return meses.map((m, i) => ({
    mes: m,
    recebidas: 30 + Math.floor(seeded(i + 1) * 40),
    resolvidas: 20 + Math.floor(seeded(i + 5) * 35),
  }));
};
