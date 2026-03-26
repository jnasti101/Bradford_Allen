"use client";

import { useRouter } from "next/navigation";
import type { Asset } from "@/lib/data";
import { formatCurrency, formatPercent } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Building2, Home, Hotel } from "lucide-react";

const typeIcon = {
  office: Building2,
  multifamily: Home,
  hospitality: Hotel,
};

const typeLabel = {
  office: "Office",
  multifamily: "Multifamily",
  hospitality: "Hospitality",
};

interface AssetTableProps {
  assets: Asset[];
}

export function AssetTable({ assets }: AssetTableProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="p-5 pb-0">
        <h3 className="text-sm font-semibold text-foreground">Top Assets</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs font-medium text-muted-foreground">
              <th className="px-5 py-3">Asset Name</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Market</th>
              <th className="px-5 py-3 text-right">IRR</th>
              <th className="px-5 py-3 text-right">Equity Multiple</th>
              <th className="px-5 py-3 text-right">Occupancy</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => {
              const Icon = typeIcon[asset.type];
              return (
                <tr
                  key={asset.id}
                  onClick={() => router.push(`/assets/${asset.id}`)}
                  className="cursor-pointer border-b last:border-0 transition-colors hover:bg-muted/50"
                >
                  <td className="px-5 py-3.5 font-medium">{asset.name}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{typeLabel[asset.type]}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {asset.market}
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-accent">
                    {formatPercent(asset.irr)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {asset.equityMultiple.toFixed(1)}x
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        asset.occupancy >= 0.9
                          ? "bg-emerald-50 text-emerald-700"
                          : asset.occupancy >= 0.8
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700"
                      )}
                    >
                      {formatPercent(asset.occupancy)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
