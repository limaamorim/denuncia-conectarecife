import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function AdminKPI({
  title,
  value,
  delta,
  icon,
  tone,
}: {
  title: string;
  value: string | number;
  delta: string;
  icon: ReactNode;
  tone: "primary" | "accent" | "success" | "warning";
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-accent",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-[oklch(0.45_0.1_70)]",
  };

  return (
    <Card className="p-5 border-0 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{delta}</div>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tones[tone]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
