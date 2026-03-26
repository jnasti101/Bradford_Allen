"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { KpiCard } from "@/components/kpi-card";
import { AssetPerformanceChart, CostBasisChart } from "@/components/charts";
import { FinancialStatements } from "@/components/financial-statements";
import {
  getAsset,
  formatCurrency,
  formatPercent,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Building2,
  Home,
  Hotel,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Percent,
} from "lucide-react";

const typeConfig = {
  office: { icon: Building2, label: "Office", color: "text-blue-600 bg-blue-50" },
  multifamily: { icon: Home, label: "Multifamily", color: "text-violet-600 bg-violet-50" },
  hospitality: { icon: Hotel, label: "Hospitality", color: "text-amber-600 bg-amber-50" },
};

export default function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const asset = getAsset(id);
  if (!asset) notFound();

  const config = typeConfig[asset.type];
  const TypeIcon = config.icon;

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Portfolio
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", config.color)}>
              <TypeIcon className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {asset.name}
              </h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {asset.market}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Acquired{" "}
                  {new Date(asset.acquisitionDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    config.color
                  )}
                >
                  {config.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          <KpiCard
            label="Purchase Price"
            value={formatCurrency(asset.purchasePrice)}
            icon={<DollarSign className="h-4 w-4" />}
          />
          <KpiCard
            label="Current Value"
            value={formatCurrency(asset.currentValue)}
            trend={
              ((asset.currentValue - asset.purchasePrice) /
                asset.purchasePrice) *
              100
            }
          />
          <KpiCard
            label="NOI"
            value={formatCurrency(asset.noi)}
            trend={4.2}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <KpiCard
            label="Cash Flow"
            value={formatCurrency(asset.cashFlow)}
            trend={3.1}
          />
          <KpiCard
            label="Cap Rate"
            value={formatPercent(asset.capRate)}
            icon={<Percent className="h-4 w-4" />}
          />
        </div>

        {/* Return Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <KpiCard label="IRR" value={formatPercent(asset.irr)} trend={1.8} />
          <KpiCard
            label="Equity Multiple"
            value={`${asset.equityMultiple.toFixed(1)}x`}
            trend={0.3}
          />
          <KpiCard
            label="Cash-on-Cash Return"
            value={formatPercent(asset.cashOnCash)}
            trend={1.1}
          />
          <KpiCard
            label="Yield"
            value={formatPercent(asset.yieldRate)}
            trend={0.5}
          />
        </div>

        {/* Performance Chart + Cost Basis */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <AssetPerformanceChart data={asset.timeline} />
          </div>
          <CostBasisChart
            acquisition={asset.acquisitionCost}
            improvements={asset.capitalImprovements}
            adjusted={asset.adjustedBasis}
          />
        </div>

        {/* Financial Statements */}
        <div className="mb-8">
          <FinancialStatements asset={asset} />
        </div>
      </main>
    </>
  );
}
