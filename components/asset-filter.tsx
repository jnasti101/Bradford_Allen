"use client";

import { cn } from "@/lib/utils";

const filters = [
  { label: "All", value: "all" },
  { label: "Office", value: "office" },
  { label: "Multifamily", value: "multifamily" },
  { label: "Hospitality", value: "hospitality" },
];

interface AssetFilterProps {
  active: string;
  onChange: (value: string) => void;
}

export function AssetFilter({ active, onChange }: AssetFilterProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-muted p-1">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
            active === f.value
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
