import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Preset = { label: string; days: number | null };

const PRESETS: Preset[] = [
  { label: "Hoje", days: 0 },
  { label: "Últimos 7 dias", days: 7 },
  { label: "Últimos 30 dias", days: 30 },
  { label: "Últimos 90 dias", days: 90 },
  { label: "Todos", days: null },
];

export function DateRangeFilter({
  value,
  onChange,
}: {
  value: DateRange | undefined;
  onChange: (r: DateRange | undefined) => void;
}) {
  const applyPreset = (p: Preset) => {
    if (p.days === null) {
      onChange(undefined);
      return;
    }
    const to = new Date();
    const from = new Date();
    if (p.days > 0) from.setDate(from.getDate() - p.days);
    else {
      from.setHours(0, 0, 0, 0);
    }
    onChange({ from, to });
  };

  const label = (() => {
    if (!value?.from) return "Selecionar período";
    if (value.to)
      return `${format(value.from, "dd MMM", { locale: ptBR })} – ${format(
        value.to,
        "dd MMM yyyy",
        { locale: ptBR },
      )}`;
    return format(value.from, "dd MMM yyyy", { locale: ptBR });
  })();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-9 justify-start text-left font-normal", !value && "text-muted-foreground")}
        >
          <CalendarIcon className="h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
        <div className="flex flex-col sm:flex-row">
          <div className="flex sm:flex-col gap-1 border-b sm:border-b-0 sm:border-r p-2 min-w-[140px]">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="text-left text-xs rounded-md px-2 py-1.5 hover:bg-muted transition"
              >
                {p.label}
              </button>
            ))}
          </div>
          <Calendar
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={1}
            locale={ptBR}
            className={cn("p-3 pointer-events-auto")}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
