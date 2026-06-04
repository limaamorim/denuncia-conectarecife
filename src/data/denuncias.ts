import type { Category, Denuncia, Status } from "@/types/denuncia";

const bairros = [
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

export const categorias: Category[] = [
  "Iluminação",
  "Vias",
  "Saneamento",
  "Meio Ambiente",
  "Limpeza",
];

const statuses: Status[] = ["Pendente", "Em Triagem", "Em Andamento", "Resolvido"];

const titulosPorCat: Partial<Record<Category, string[]>> = {
  Iluminação: ["Poste sem luz há 3 dias", "Lâmpada queimada na praça", "Iluminação intermitente"],
  Vias: ["Buraco grande na via", "Calçada destruída", "Sinalização apagada"],
  Saneamento: ["Vazamento de esgoto", "Bueiro entupido", "Água parada"],
  "Meio Ambiente": ["Descarte irregular de lixo", "Árvore caída", "Poluição em córrego"],
  Limpeza: ["Acúmulo de lixo", "Container quebrado", "Entulho na esquina"],
};

function seeded(i: number) {
  return ((i * 9301 + 49297) % 233280) / 233280;
}

export const denuncias: Denuncia[] = Array.from({ length: 48 }).map((_, i) => {
  const cat = categorias[i % categorias.length];
  const status = statuses[Math.floor(seeded(i + 1) * statuses.length)];
  const daysAgo = Math.floor(seeded(i + 7) * 60);
  const date = new Date(Date.now() - daysAgo * 86400000);
  const titulos = titulosPorCat[cat] ?? ["Ocorrência urbana"];

  return {
    id: `c${i + 1}`,
    protocolo: `REC-${String(2024000 + i).padStart(7, "0")}`,
    titulo: titulos[i % titulos.length],
    descricao:
      "Solicitação registrada pelo cidadão via Conecta Recife. Necessita avaliação e encaminhamento ao órgão responsável.",
    categoria: cat,
    status,
    bairro: bairros[i % bairros.length],
    data: date.toISOString(),
    lat: -8.05 + (seeded(i + 11) - 0.5) * 0.08,
    lng: -34.9 + (seeded(i + 13) - 0.5) * 0.08,
    iaConfianca: 70 + Math.floor(seeded(i + 17) * 29),
    iaSugestao: cat,
    cidadao: i % 3 === 0 ? "cidadao@recife.gov" : `cidadao${i}@email.com`,
    timeline: [
      { label: "Recebido", date: date.toISOString(), done: true },
      {
        label: "Analisado por IA",
        date: new Date(date.getTime() + 3600000).toISOString(),
        done: status !== "Pendente",
      },
      {
        label: "Encaminhado ao órgão",
        date: new Date(date.getTime() + 86400000).toISOString(),
        done: ["Em Andamento", "Resolvido"].includes(status),
      },
      {
        label: status === "Resolvido" ? "Resolvido" : "Em andamento",
        date: new Date(date.getTime() + 3 * 86400000).toISOString(),
        done: status === "Resolvido",
      },
    ],
  };
});
