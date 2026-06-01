import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — Conecta Recife" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(email, password);
      toast.success(`Bem-vindo, ${u.nome}`);
      navigate({ to: u.role === "admin" ? "/admin" : "/cidadao" });
    } catch (err) {
      const message = err instanceof Error ? err.message : undefined;
      toast.error(message ?? "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-12 overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10 backdrop-blur font-bold">
            CR
          </div>
          <div>
            <div className="text-sm opacity-80">Prefeitura do Recife</div>
            <div className="text-lg font-semibold">Conecta Recife</div>
          </div>
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold leading-tight">
            Gestão estratégica
            <br />
            de denúncias urbanas
          </h1>
          <p className="mt-4 text-primary-foreground/80">
            Triagem inteligente com IA, encaminhamento automático e acompanhamento em tempo real
            para cidadãos e gestores.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-2 text-sm text-primary-foreground/70">
          <ShieldCheck className="h-4 w-4" /> Plataforma segura e governamental
        </div>
        {/* decorative blobs */}
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Entrar na plataforma</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Acesse com seu e-mail institucional ou de cidadão.
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="voce@recife.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pwd">Senha</Label>
              <Input
                id="pwd"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <div className="mt-6 rounded-lg border bg-muted/40 p-4 text-xs text-muted-foreground">
            <div className="font-medium text-foreground mb-1">Acessos demo</div>
            <div>
              • Cidadão: qualquer e-mail (ex.: <span className="font-mono">cidadao@recife.gov</span>
              )
            </div>
            <div>
              • Admin: e-mail contendo <span className="font-mono">admin</span> (ex.:{" "}
              <span className="font-mono">admin@recife.gov</span>)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
