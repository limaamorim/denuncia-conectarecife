import type { Status } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const map: Record<Status, string> = {
  "Pendente": "bg-warning/15 text-warning-foreground border-warning/40",
  "Em Triagem": "bg-accent/15 text-accent border-accent/40",
  "Em Andamento": "bg-primary/10 text-primary border-primary/30",
  "Resolvido": "bg-success/15 text-success border-success/40",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", map[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
