import { useState } from "react";
import { denuncias } from "@/data/denuncias";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Sparkles, Check, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";

export function FilaTriagem() {
  const [rows, setRows] = useState(() => denuncias.slice(0, 14));

  const aprovar = (id: string) => {
    setRows((r) => r.filter((x) => x.id !== id));
    toast.success("Denúncia aprovada e despachada ao órgão.");
  };

  const alterar = (id: string) => {
    toast.info("Abrir destino alternativo para " + id);
  };

  return (
    <Card className="overflow-hidden border-0 shadow-card">
      <div className="border-b p-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-accent" /> Fila de triagem assistida por IA
        </h3>
        <p className="text-xs text-muted-foreground">
          Revise as sugestões de categoria e aprove o despacho.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Título</th>
              <th className="px-4 py-3 text-left">Categoria sugerida</th>
              <th className="px-4 py-3 text-left">Confiança</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs text-primary">{d.protocolo}</td>
                <td className="px-4 py-3 font-medium text-foreground max-w-[260px] truncate">
                  {d.titulo}
                </td>
                <td className="px-4 py-3">
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent border border-accent/30">
                    <Sparkles className="h-3 w-3" /> {d.iaSugestao}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-primary"
                        style={{ width: `${d.iaConfianca}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{d.iaConfianca}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={d.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <Button
                      size="sm"
                      className="bg-success hover:bg-success/90 text-success-foreground h-8"
                      onClick={() => aprovar(d.id)}
                    >
                      <Check className="h-3.5 w-3.5" /> Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8"
                      onClick={() => alterar(d.id)}
                    >
                      <ArrowRightLeft className="h-3.5 w-3.5" /> Alterar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
