import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";

export function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            CR
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-foreground leading-tight">Conecta Recife</div>
            <div className="text-xs text-muted-foreground leading-tight">Gestão Estratégica de Denúncias</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate({ to: "/login" }); }}>
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          )}
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
            <ArrowLeft className="h-4 w-4" /> Voltar para o Conecta Recife
          </Button>
        </div>
      </div>
    </header>
  );
}
