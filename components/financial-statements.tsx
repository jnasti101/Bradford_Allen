"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatFullCurrency, formatPercent } from "@/lib/data";
import type { Asset } from "@/lib/data";
import {
  exportIncomeStatement,
  exportCashFlowStatement,
  exportLeaseSchedule,
  exportRentRoll,
} from "@/lib/export";
import { Download, FileText, DollarSign, Building2, Home, Hotel } from "lucide-react";

interface FinancialStatementsProps {
  asset: Asset;
}

type Tab = "income" | "cashflow" | "rentroll";

function getThirdTabLabel(type: Asset["type"]): string {
  if (type === "office") return "Lease Schedule";
  if (type === "hospitality") return "Revenue Detail";
  return "Rent Roll";
}

export function FinancialStatements({ asset }: FinancialStatementsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("income");

  const tabs: { key: Tab; label: string }[] = [
    { key: "income", label: "Income Statement" },
    { key: "cashflow", label: "Cash Flow" },
    { key: "rentroll", label: getThirdTabLabel(asset.type) },
  ];

  const handleExport = () => {
    if (activeTab === "income") {
      exportIncomeStatement(asset.name, asset.incomeStatement);
    } else if (activeTab === "cashflow") {
      exportCashFlowStatement(asset.name, asset.cashFlowStatement);
    } else if (activeTab === "rentroll") {
      if (asset.type === "office" && asset.leases) {
        exportLeaseSchedule(asset.name, asset.leases);
      } else if (asset.rentRoll) {
        exportRentRoll(asset.name, asset.rentRoll);
      }
    }
  };

  const canExport = activeTab !== "rentroll" || asset.type !== "hospitality";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          Financial Reporting
        </h2>
        {canExport && (
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "rounded-md px-3.5 py-1.5 text-xs font-medium transition-all",
              activeTab === tab.key
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "income" && <IncomeStatementTable data={asset.incomeStatement} />}
      {activeTab === "cashflow" && <CashFlowTable data={asset.cashFlowStatement} />}
      {activeTab === "rentroll" && <RentRollTab asset={asset} />}
    </div>
  );
}

/* ─── Income Statement ─── */

function IncomeStatementTable({ data }: { data: Asset["incomeStatement"] }) {
  const fmt = (n: number) => {
    if (n < 0) return `(${formatFullCurrency(Math.abs(n))})`;
    return formatFullCurrency(n);
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs font-medium text-muted-foreground">
              <th className="sticky left-0 bg-card px-5 py-3 min-w-[220px]"></th>
              {data.map((d) => (
                <th key={d.period} className="px-4 py-3 text-right whitespace-nowrap">
                  {d.period}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <SectionHeader label="REVENUE" cols={data.length} />
            <Row label="Base Rental Income" values={data.map((d) => fmt(d.baseRentalIncome))} />
            <Row label="Tenant Reimbursements" values={data.map((d) => fmt(d.tenantReimbursements))} />
            <Row label="Parking Income" values={data.map((d) => fmt(d.parkingIncome))} />
            <Row label="Other Income" values={data.map((d) => fmt(d.otherIncome))} />
            <Row
              label="Less: Vacancy & Credit Loss"
              values={data.map((d) => fmt(d.vacancyLoss))}
              negative
            />
            <SubtotalRow label="Effective Gross Income" values={data.map((d) => fmt(d.effectiveGrossIncome))} />

            <SectionHeader label="OPERATING EXPENSES" cols={data.length} />
            <Row label="Property Management" values={data.map((d) => fmt(d.propertyManagement))} />
            <Row label="Insurance" values={data.map((d) => fmt(d.insurance))} />
            <Row label="Utilities" values={data.map((d) => fmt(d.utilities))} />
            <Row label="Repairs & Maintenance" values={data.map((d) => fmt(d.repairsAndMaintenance))} />
            <Row label="Property Taxes" values={data.map((d) => fmt(d.propertyTaxes))} />
            <Row label="General & Administrative" values={data.map((d) => fmt(d.generalAndAdmin))} />
            <SubtotalRow label="Total Operating Expenses" values={data.map((d) => fmt(d.totalOperatingExpenses))} />

            <TotalRow label="Net Operating Income" values={data.map((d) => fmt(d.netOperatingIncome))} accent />
            <Row label="Debt Service" values={data.map((d) => fmt(d.debtService))} />
            <Row label="Capital Reserves" values={data.map((d) => fmt(d.capitalReserves))} />
            <TotalRow label="Net Income" values={data.map((d) => fmt(d.netIncome))} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Cash Flow Statement ─── */

function CashFlowTable({ data }: { data: Asset["cashFlowStatement"] }) {
  const fmt = (n: number) => {
    if (n < 0) return `(${formatFullCurrency(Math.abs(n))})`;
    return formatFullCurrency(n);
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs font-medium text-muted-foreground">
              <th className="sticky left-0 bg-card px-5 py-3 min-w-[220px]"></th>
              {data.map((d) => (
                <th key={d.period} className="px-4 py-3 text-right whitespace-nowrap">
                  {d.period}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <SectionHeader label="OPERATING ACTIVITIES" cols={data.length} />
            <Row label="Net Operating Income" values={data.map((d) => fmt(d.netOperatingIncome))} />
            <Row label="Depreciation & Amortization" values={data.map((d) => fmt(d.adjustmentsNonCash))} />
            <Row label="Changes in Working Capital" values={data.map((d) => fmt(d.changesInWorkingCapital))} />
            <SubtotalRow label="Net Cash from Operations" values={data.map((d) => fmt(d.netCashFromOperations))} />

            <SectionHeader label="INVESTING ACTIVITIES" cols={data.length} />
            <Row label="Capital Expenditures" values={data.map((d) => fmt(d.capitalExpenditures))} negative />
            <Row label="Tenant Improvements" values={data.map((d) => fmt(d.tenantImprovements))} negative />
            <Row label="Leasing Commissions" values={data.map((d) => fmt(d.leasingCommissions))} negative />
            <SubtotalRow label="Net Cash from Investing" values={data.map((d) => fmt(d.netCashFromInvesting))} />

            <SectionHeader label="FINANCING ACTIVITIES" cols={data.length} />
            <Row label="Mortgage Principal" values={data.map((d) => fmt(d.mortgagePrincipalPayment))} negative />
            <Row label="Distributions" values={data.map((d) => fmt(d.distributions))} negative />
            <SubtotalRow label="Net Cash from Financing" values={data.map((d) => fmt(d.netCashFromFinancing))} />

            <TotalRow label="Net Change in Cash" values={data.map((d) => fmt(d.netCashFlow))} accent />
            <Row label="Beginning Cash Balance" values={data.map((d) => fmt(d.beginningCashBalance))} />
            <TotalRow label="Ending Cash Balance" values={data.map((d) => fmt(d.endingCashBalance))} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Rent Roll / Lease Schedule Tab ─── */

function RentRollTab({ asset }: { asset: Asset }) {
  if (asset.type === "office" && asset.leases) {
    return (
      <div className="space-y-4">
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
                  <tr key={lease.tenant} className="border-b last:border-0">
                    <td className="px-5 py-3 font-medium">{lease.tenant}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(lease.leaseStart).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(lease.leaseEnd).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3 text-right font-medium">${lease.rent}</td>
                    <td className="px-5 py-3 text-muted-foreground">{lease.escalation}</td>
                    <td className="px-5 py-3 text-right">{formatFullCurrency(lease.tiLcCosts)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {asset.camSummary && (
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold">CAM (Common Area Maintenance)</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {asset.camSummary.map((item) => (
                <div key={item.category} className="text-center">
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                  <p className="mt-1 text-sm font-semibold">{formatFullCurrency(item.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (asset.type === "multifamily" && asset.rentRoll) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Occupancy</p>
            <p className="mt-1 text-xl font-semibold">{formatPercent(asset.occupancy)}</p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Total Units</p>
            <p className="mt-1 text-xl font-semibold">{asset.rentRoll.length}</p>
          </div>
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
                  <tr key={unit.unit} className="border-b last:border-0">
                    <td className="px-5 py-3 font-medium">{unit.unit}</td>
                    <td className="px-5 py-3 text-right font-medium">${unit.rent.toLocaleString()}</td>
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
                    <td className="px-5 py-3 text-muted-foreground">{unit.tenant}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (asset.type === "hospitality" && asset.hospitalityMetrics) {
    const m = asset.hospitalityMetrics;
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">ADR (Avg Daily Rate)</p>
            <p className="mt-1 text-xl font-semibold">${m.adr}</p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">RevPAR</p>
            <p className="mt-1 text-xl font-semibold">${m.revpar}</p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Occupancy</p>
            <p className="mt-1 text-xl font-semibold">{formatPercent(m.occupancy)}</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                  <th className="px-5 py-3">Month</th>
                  <th className="px-5 py-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {m.revenueTrend.map((r) => (
                  <tr key={r.month} className="border-b last:border-0">
                    <td className="px-5 py-3">{r.month}</td>
                    <td className="px-5 py-3 text-right font-medium">{formatFullCurrency(r.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return <p className="text-sm text-muted-foreground">No data available.</p>;
}

/* ─── Table Helper Components ─── */

function SectionHeader({ label, cols }: { label: string; cols: number }) {
  return (
    <tr className="bg-muted/50">
      <td className="sticky left-0 bg-muted/50 px-5 py-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase" colSpan={cols + 1}>
        {label}
      </td>
    </tr>
  );
}

function Row({ label, values, negative }: { label: string; values: string[]; negative?: boolean }) {
  return (
    <tr className="border-b last:border-0">
      <td className="sticky left-0 bg-card px-5 py-2.5 text-sm text-muted-foreground whitespace-nowrap">
        {label}
      </td>
      {values.map((v, i) => (
        <td
          key={i}
          className={cn(
            "px-4 py-2.5 text-right text-sm tabular-nums whitespace-nowrap",
            negative && v.startsWith("(") && "text-red-600"
          )}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}

function SubtotalRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr className="border-b border-t bg-muted/30">
      <td className="sticky left-0 bg-muted/30 px-5 py-2.5 text-sm font-semibold whitespace-nowrap">
        {label}
      </td>
      {values.map((v, i) => (
        <td key={i} className="px-4 py-2.5 text-right text-sm font-semibold tabular-nums whitespace-nowrap">
          {v}
        </td>
      ))}
    </tr>
  );
}

function TotalRow({ label, values, accent }: { label: string; values: string[]; accent?: boolean }) {
  return (
    <tr className="border-b-2 border-t">
      <td className={cn("sticky left-0 bg-card px-5 py-3 text-sm font-bold whitespace-nowrap", accent && "text-accent")}>
        {label}
      </td>
      {values.map((v, i) => (
        <td
          key={i}
          className={cn(
            "px-4 py-3 text-right text-sm font-bold tabular-nums whitespace-nowrap",
            accent && "text-accent"
          )}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}
