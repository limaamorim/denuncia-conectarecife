import type { Category, Denuncia, Status } from "@/types/denuncia";
import { classificarUrgencia } from "@/lib/urgencia";

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

const midiasPorCat: Partial<Record<Category, string[]>> = {
  Iluminação: [
    "https://images.unsplash.com/photo-1519750013887-b9b5d2bb5fe1?w=800&q=70",
    "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=800&q=70",
  ],
  Vias: [
    "https://images.unsplash.com/photo-1597007030739-6d2e7172ee6c?w=800&q=70",
    "https://images.unsplash.com/photo-1545158539-1709e5d7c2a4?w=800&q=70",
  ],
  Saneamento: [
    "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&q=70",
  ],
  "Meio Ambiente": [
    "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&q=70",
  ],
  Limpeza: [
    "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&q=70",
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=70",
  ],
};

export const denuncias: Denuncia[] = Array.from({ length: 48 }).map((_, i) => {
  const cat = categorias[i % categorias.length];
  const status = statuses[Math.floor(seeded(i + 1) * statuses.length)];
  const daysAgo = Math.floor(seeded(i + 7) * 60);
  const date = new Date(Date.now() - daysAgo * 86400000);
  const titulos = titulosPorCat[cat] ?? ["Ocorrência urbana"];
  const fotos = midiasPorCat[cat] ?? [];
  const numFotos = (i % 3) + 1;
  const midias = fotos.slice(0, Math.min(numFotos, fotos.length)).map((url, k) => ({
    url,
    nome: `evidencia_${i + 1}_${k + 1}.jpg`,
    tipo: "imagem" as const,
  }));

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
    iaUrgencia: classificarUrgencia(cat).urgencia,
    iaUrgenciaMotivo: classificarUrgencia(cat).motivo,
    cidadao: i % 3 === 0 ? "cidadao@recife.gov" : `cidadao${i}@email.com`,
    midias,
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
