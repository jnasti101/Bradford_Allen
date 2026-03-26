"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { KpiCard } from "@/components/kpi-card";
import {
  AssetPerformanceChart,
  CostBasisChart,
  AvgRentChart,
  RevenueTrendChart,
} from "@/components/charts";
import {
  getAsset,
  formatCurrency,
  formatPercent,
  formatFullCurrency,
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

        {/* Asset-Type-Specific Sections */}
        {asset.type === "office" && asset.leases && (
          <div className="space-y-6 mb-8">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              Lease Schedule
            </h2>
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                      <th className="px-5 py-3">Tenant</th>
                      <th className="px-5 py-3">Lease Start</th>
                      <th className="px-5 py-3">Lease End</th>
                      <th className="px-5 py-3 text-right">Rent ($/SF)</th>
                      <th className="px-5 py-3">Escalations</th>
                      <th className="px-5 py-3 text-right">TI/LC Costs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asset.leases.map((lease) => (
                      <tr
                        key={lease.tenant}
                        className="border-b last:border-0"
                      >
                        <td className="px-5 py-3 font-medium">
                          {lease.tenant}
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {new Date(lease.leaseStart).toLocaleDateString(
                            "en-US",
                            { month: "short", year: "numeric" }
                          )}
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {new Date(lease.leaseEnd).toLocaleDateString(
                            "en-US",
                            { month: "short", year: "numeric" }
                          )}
                        </td>
                        <td className="px-5 py-3 text-right font-medium">
                          ${lease.rent}
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {lease.escalation}
                        </td>
                        <td className="px-5 py-3 text-right">
                          {formatCurrency(lease.tiLcCosts)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {asset.camSummary && (
              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold">
                  CAM (Common Area Maintenance)
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {asset.camSummary.map((item) => (
                    <div key={item.category} className="text-center">
                      <p className="text-xs text-muted-foreground">
                        {item.category}
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {formatCurrency(item.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {asset.type === "multifamily" && asset.rentRoll && (
          <div className="space-y-6 mb-8">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Home className="h-5 w-5 text-muted-foreground" />
              Rent Roll
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 mb-4">
              <KpiCard
                label="Occupancy"
                value={formatPercent(asset.occupancy)}
                trend={1.2}
              />
              <KpiCard
                label="Units"
                value={`${asset.rentRoll.length}`}
              />
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                      <th className="px-5 py-3">Unit #</th>
                      <th className="px-5 py-3 text-right">Rent</th>
                      <th className="px-5 py-3">Lease Status</th>
                      <th className="px-5 py-3">Tenant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asset.rentRoll.map((unit) => (
                      <tr
                        key={unit.unit}
                        className="border-b last:border-0"
                      >
                        <td className="px-5 py-3 font-medium">{unit.unit}</td>
                        <td className="px-5 py-3 text-right font-medium">
                          ${unit.rent.toLocaleString()}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                              unit.leaseStatus === "Occupied"
                                ? "bg-emerald-50 text-emerald-700"
                                : unit.leaseStatus === "Notice"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-700"
                            )}
                          >
                            {unit.leaseStatus}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {unit.tenant}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {asset.avgRentTrend && <AvgRentChart data={asset.avgRentTrend} />}
          </div>
        )}

        {asset.type === "hospitality" && asset.hospitalityMetrics && (
          <div className="space-y-6 mb-8">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Hotel className="h-5 w-5 text-muted-foreground" />
              Hospitality Metrics
            </h2>

            <div className="grid gap-4 sm:grid-cols-3">
              <KpiCard
                label="ADR (Avg Daily Rate)"
                value={`$${asset.hospitalityMetrics.adr}`}
                trend={3.8}
              />
              <KpiCard
                label="RevPAR"
                value={`$${asset.hospitalityMetrics.revpar}`}
                trend={5.2}
              />
              <KpiCard
                label="Occupancy"
                value={formatPercent(asset.hospitalityMetrics.occupancy)}
                trend={2.1}
              />
            </div>

            <RevenueTrendChart
              data={asset.hospitalityMetrics.revenueTrend}
            />
          </div>
        )}
      </main>
    </>
  );
}
