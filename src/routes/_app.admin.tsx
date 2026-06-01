import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/features/admin/AdminPage";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({ meta: [{ title: "Dashboard Admin — Conecta Recife" }] }),
  component: AdminPage,
});
