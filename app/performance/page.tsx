"use client";

import { useState } from "react";
import { Nav } from "@/components/nav";
import { TimeRangeSelector } from "@/components/time-range-selector";
import { HistoricalChart } from "@/components/charts";
import { portfolio } from "@/lib/data";

export default function PerformancePage() {
  const [timeRange, setTimeRange] = useState("All");

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Historical Performance
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Portfolio performance metrics over time
            </p>
          </div>
          <TimeRangeSelector active={timeRange} onChange={setTimeRange} />
        </div>

        <HistoricalChart data={portfolio.timeline} timeRange={timeRange} />
      </main>
    </>
  );
}
