export type Status = "Pendente" | "Em Triagem" | "Em Andamento" | "Resolvido";
export type Category = "Iluminação" | "Vias" | "Saneamento" | "Meio Ambiente" | "Limpeza";

export interface Denuncia {
  id: string;
  protocolo: string;
  titulo: string;
  descricao: string;
  categoria: Category;
  status: Status;
  bairro: string;
  data: string;
  lat: number;
  lng: number;
  iaConfianca: number;
  iaSugestao: Category;
  cidadao: string;
  timeline: { label: string; date: string; done: boolean }[];
}
