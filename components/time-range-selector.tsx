"use client";

import { cn } from "@/lib/utils";

const ranges = ["1Y", "3Y", "5Y", "All"];

interface TimeRangeSelectorProps {
  active: string;
  onChange: (value: string) => void;
}

export function TimeRangeSelector({ active, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-muted p-1">
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
            active === r
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
