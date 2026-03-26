"use client";

import { useState } from "react";
import { Nav } from "@/components/nav";
import { KpiCard } from "@/components/kpi-card";
import { PerformanceChart, AllocationChart } from "@/components/charts";
import { AssetTable } from "@/components/asset-table";
import { AssetFilter } from "@/components/asset-filter";
import { portfolio, assets, formatCurrency, formatPercent } from "@/lib/data";
import {
  DollarSign,
  TrendingUp,
  Percent,
  Users,
  Landmark,
} from "lucide-react";

export default function PortfolioDashboard() {
  const [filter, setFilter] = useState("all");

  const filteredAssets =
    filter === "all" ? assets : assets.filter((a) => a.type === filter);

  const allocation = [
    {
      name: "Office",
      value: assets
        .filter((a) => a.type === "office")
        .reduce((s, a) => s + a.currentValue, 0),
    },
    {
      name: "Multifamily",
      value: assets
        .filter((a) => a.type === "multifamily")
        .reduce((s, a) => s + a.currentValue, 0),
    },
    {
      name: "Hospitality",
      value: assets
        .filter((a) => a.type === "hospitality")
        .reduce((s, a) => s + a.currentValue, 0),
    },
  ];

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Portfolio Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bradford Allen — Real estate portfolio analytics
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          <KpiCard
            label="Total Portfolio Value"
            value={formatCurrency(portfolio.totalValue)}
            trend={8.2}
            icon={<DollarSign className="h-4 w-4" />}
          />
          <KpiCard
            label="Net Operating Income"
            value={formatCurrency(portfolio.noi)}
            trend={5.1}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <KpiCard
            label="IRR (Blended)"
            value={formatPercent(portfolio.irr)}
            trend={2.3}
            icon={<Percent className="h-4 w-4" />}
          />
          <KpiCard
            label="Occupancy Rate"
            value={formatPercent(portfolio.occupancy)}
            trend={1.2}
            icon={<Users className="h-4 w-4" />}
          />
          <KpiCard
            label="Equity Invested"
            value={formatCurrency(portfolio.equityInvested)}
            icon={<Landmark className="h-4 w-4" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <PerformanceChart data={portfolio.timeline} />
          </div>
          <AllocationChart data={allocation} />
        </div>

        {/* Assets Table */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Assets</h2>
          <AssetFilter active={filter} onChange={setFilter} />
        </div>
        <AssetTable assets={filteredAssets} />
      </main>
    </>
  );
}
