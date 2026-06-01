import { createFileRoute } from "@tanstack/react-router";
import { CidadaoPage } from "@/features/cidadao/CidadaoPage";

export const Route = createFileRoute("/_app/cidadao")({
  head: () => ({ meta: [{ title: "Painel do Cidadão — Conecta Recife" }] }),
  component: CidadaoPage,
});
