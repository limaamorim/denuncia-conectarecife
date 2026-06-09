export type Status = "Pendente" | "Em Triagem" | "Em Andamento" | "Resolvido";

export type Category =
  // Categorias urbanas originais (preservadas)
  | "Iluminação"
  | "Vias"
  | "Saneamento"
  | "Meio Ambiente"
  | "Limpeza"
  // Novas categorias
  | "Violência Física"
  | "Violência Doméstica"
  | "Violência Sexual"
  | "Maus-tratos a Animais"
  | "Crimes Ambientais"
  | "Fraude / Golpe"
  | "Problemas Urbanos"
  | "Iluminação Pública"
  | "Buracos em Vias"
  | "Coleta de Lixo"
  | "Outros";

export type Urgencia = "Alta" | "Média" | "Baixa";

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
  iaUrgencia?: Urgencia;
  iaUrgenciaMotivo?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  cidadao: string;
  midias?: { url: string; nome?: string; tipo?: "imagem" | "video" }[];
  timeline: { label: string; date: string; done: boolean }[];
}
