import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  trend?: number;
  icon?: React.ReactNode;
}

export function KpiCard({ label, value, trend, icon }: KpiCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {trend !== undefined && (
        <div className="mt-2 flex items-center gap-1">
          {trend >= 0 ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              trend >= 0 ? "text-emerald-600" : "text-red-500"
            )}
          >
            {trend >= 0 ? "+" : ""}
            {trend.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}
