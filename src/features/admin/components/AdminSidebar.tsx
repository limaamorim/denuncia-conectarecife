import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileBarChart, LayoutDashboard, ListChecks, Settings } from "lucide-react";

export function AdminSidebar({
  view,
  onViewChange,
}: {
  view: "overview" | "triagem" | "config";
  onViewChange: (view: "overview" | "triagem" | "config") => void;
}) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <Card className="p-2 border-0 shadow-soft">
        <nav className="flex lg:flex-col gap-1">
          <SidebarBtn
            icon={<LayoutDashboard className="h-4 w-4" />}
            active={view === "overview"}
            onClick={() => onViewChange("overview")}
          >
            Visão Geral
          </SidebarBtn>
          <SidebarBtn
            icon={<ListChecks className="h-4 w-4" />}
            active={view === "triagem"}
            onClick={() => onViewChange("triagem")}
          >
            Fila de Triagem
          </SidebarBtn>
          <SidebarBtn
            icon={<Settings className="h-4 w-4" />}
            active={view === "config"}
            onClick={() => onViewChange("config")}
          >
            Configurações
          </SidebarBtn>
        </nav>
      </Card>
      <div className="hidden lg:block mt-4 rounded-xl bg-primary p-4 text-primary-foreground">
        <FileBarChart className="h-5 w-5" />
        <div className="mt-2 text-sm font-semibold">Relatório mensal</div>
        <div className="text-xs text-primary-foreground/80">Exporte indicadores em PDF.</div>
        <Button size="sm" variant="secondary" className="mt-3 w-full">
          Gerar relatório
        </Button>
      </div>
    </aside>
  );
}

function SidebarBtn({
  icon,
  children,
  active,
  onClick,
}: {
  icon: ReactNode;
  children: ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition w-full text-left ${active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
    >
      {icon}
      {children}
    </button>
  );
}
