"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import { cn } from "@/lib/utils";
import type { TimelineEntry } from "@/lib/data";
import { formatCurrency } from "@/lib/data";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const currencyFormatter = (value: any) => formatCurrency(Number(value));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const percentFormatter = (value: any) => `${(Number(value) * 100).toFixed(1)}%`;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dollarFormatter = (value: any) => `$${Number(value).toLocaleString()}`;

const COLORS = ["#0891b2", "#6366f1", "#f59e0b", "#10b981", "#ef4444"];

interface PerformanceChartProps {
  data: TimelineEntry[];
  timeRange?: string;
}

const SERIES = [
  { key: "portfolioValue" as const, label: "Portfolio Value", color: "#0891b2", gradientId: "colorValue" },
  { key: "noi" as const, label: "NOI", color: "#6366f1", gradientId: "colorNoi" },
  { key: "cashFlow" as const, label: "Cash Flow", color: "#10b981", gradientId: "colorCf" },
];

export function PerformanceChart({ data }: PerformanceChartProps) {
  const [range, setRange] = useState("All");
  const filtered = filterByRange(data, range);
  const [visible, setVisible] = useState<Record<string, boolean>>({
    portfolioValue: true,
    noi: true,
    cashFlow: true,
  });

  const toggle = (key: string) =>
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Performance Over Time
        </h3>
        <div className="flex items-center gap-3">
          <TimeRangeButtons active={range} onChange={setRange} />
          <div className="flex gap-1.5">
          {SERIES.map((s) => (
            <button
              key={s.key}
              onClick={() => toggle(s.key)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                visible[s.key]
                  ? "bg-white shadow-sm border"
                  : "bg-muted text-muted-foreground opacity-60"
              )}
            >
              <div
                className="h-2 w-2 rounded-full transition-opacity"
                style={{
                  backgroundColor: s.color,
                  opacity: visible[s.key] ? 1 : 0.3,
                }}
              />
              {s.label}
            </button>
          ))}
          </div>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filtered}>
            <defs>
              {SERIES.map((s) => (
                <linearGradient key={s.gradientId} id={s.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
              tickFormatter={(v) => formatCurrency(v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={currencyFormatter}
            />
            {SERIES.map((s) =>
              visible[s.key] ? (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2}
                  fill={`url(#${s.gradientId})`}
                />
              ) : null
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface AllocationChartProps {
  data: { name: string; value: number }[];
}

export function AllocationChart({ data }: AllocationChartProps) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Asset Allocation
      </h3>
      <div className="h-72 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={currencyFormatter}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-4">
        {data.map((item, idx) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span className="text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface AssetPerformanceChartProps {
  data: TimelineEntry[];
}

const ASSET_SERIES = [
  { key: "portfolioValue" as const, label: "Valuation", color: "#0891b2" },
  { key: "noi" as const, label: "NOI", color: "#6366f1" },
  { key: "cashFlow" as const, label: "Cash Flow", color: "#10b981" },
];

export function AssetPerformanceChart({ data }: AssetPerformanceChartProps) {
  const [range, setRange] = useState("All");
  const filtered = filterByRange(data, range);
  const [visible, setVisible] = useState<Record<string, boolean>>({
    portfolioValue: true,
    noi: true,
    cashFlow: true,
  });

  const toggle = (key: string) =>
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Asset Performance
        </h3>
        <div className="flex items-center gap-3">
          <TimeRangeButtons active={range} onChange={setRange} />
          <div className="flex gap-1.5">
          {ASSET_SERIES.map((s) => (
            <button
              key={s.key}
              onClick={() => toggle(s.key)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                visible[s.key]
                  ? "bg-white shadow-sm border"
                  : "bg-muted text-muted-foreground opacity-60"
              )}
            >
              <div
                className="h-2 w-2 rounded-full transition-opacity"
                style={{
                  backgroundColor: s.color,
                  opacity: visible[s.key] ? 1 : 0.3,
                }}
              />
              {s.label}
            </button>
          ))}
          </div>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filtered}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
              tickFormatter={(v) => formatCurrency(v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={currencyFormatter}
            />
            {ASSET_SERIES.map((s) =>
              visible[s.key] ? (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={false}
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface CostBasisChartProps {
  acquisition: number;
  improvements: number;
  adjusted: number;
}

export function CostBasisChart({
  acquisition,
  improvements,
  adjusted,
}: CostBasisChartProps) {
  const data = [
    { name: "Acquisition", value: acquisition },
    { name: "Cap. Improvements", value: improvements },
  ];
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Cost Basis Tracking
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barSize={28}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickFormatter={(v) => formatCurrency(v)}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "#64748b" }}
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={currencyFormatter}
            />
            <Bar dataKey="value" fill="#0891b2" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <span className="text-sm font-medium text-muted-foreground">
          Adjusted Basis
        </span>
        <span className="text-sm font-semibold">{formatCurrency(adjusted)}</span>
      </div>
    </div>
  );
}

interface AvgRentChartProps {
  data: { month: string; avgRent: number }[];
}

export function AvgRentChart({ data }: AvgRentChartProps) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Average Rent Trend
      </h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#64748b" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickLine={false}
              domain={["auto", "auto"]}
              tickFormatter={(v) => `$${v.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={dollarFormatter}
            />
            <Area
              type="monotone"
              dataKey="avgRent"
              name="Avg Rent"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#colorRent)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface RevenueTrendChartProps {
  data: { month: string; revenue: number }[];
}

export function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Revenue Trend
      </h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#64748b" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickLine={false}
              domain={["auto", "auto"]}
              tickFormatter={(v) => formatCurrency(v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={currencyFormatter}
            />
            <Bar dataKey="revenue" name="Revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const TIME_RANGES = [
  { label: "4Q", quarters: 4 },
  { label: "8Q", quarters: 8 },
  { label: "12Q", quarters: 12 },
  { label: "All", quarters: 0 },
];

function filterByRange(data: TimelineEntry[], range?: string): TimelineEntry[] {
  if (!range || range === "All") return data;
  const match = TIME_RANGES.find((r) => r.label === range);
  if (!match || match.quarters === 0) return data;
  return data.slice(-match.quarters);
}

function TimeRangeButtons({ active, onChange }: { active: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-0.5 rounded-lg bg-muted p-0.5">
      {TIME_RANGES.map((r) => (
        <button
          key={r.label}
          onClick={() => onChange(r.label)}
          className={cn(
            "rounded-md px-2 py-1 text-[11px] font-medium transition-all",
            active === r.label
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

interface HistoricalChartProps {
  data: TimelineEntry[];
  timeRange: string;
}

export function HistoricalChart({ data, timeRange }: HistoricalChartProps) {
  const filtered = filterByRange(data, timeRange);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Portfolio Value
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filtered}>
              <defs>
                <linearGradient id="histValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} domain={["auto", "auto"]} tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} formatter={currencyFormatter} />
              <Area type="monotone" dataKey="portfolioValue" name="Portfolio Value" stroke="#0891b2" strokeWidth={2} fill="url(#histValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            IRR Progression
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filtered}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} domain={["auto", "auto"]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} formatter={percentFormatter} />
                <Line type="monotone" dataKey="irr" name="IRR" stroke="#6366f1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Cash Flow
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filtered}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} domain={["auto", "auto"]} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} formatter={currencyFormatter} />
                <Bar dataKey="cashFlow" name="Cash Flow" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
