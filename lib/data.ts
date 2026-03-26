// Mock data for Bradford Allen demo

export interface TimelineEntry {
  date: string;
  portfolioValue: number;
  noi: number;
  cashFlow: number;
  irr: number;
}

export interface LeaseEntry {
  tenant: string;
  leaseStart: string;
  leaseEnd: string;
  rent: number;
  escalation: string;
  tiLcCosts: number;
}

export interface RentRollEntry {
  unit: string;
  rent: number;
  leaseStatus: "Occupied" | "Vacant" | "Notice";
  tenant: string;
}

export interface HospitalityMetrics {
  adr: number;
  revpar: number;
  occupancy: number;
  revenueTrend: { month: string; revenue: number }[];
}

export interface Asset {
  id: string;
  name: string;
  type: "office" | "multifamily" | "hospitality";
  market: string;
  acquisitionDate: string;
  purchasePrice: number;
  currentValue: number;
  noi: number;
  cashFlow: number;
  capRate: number;
  irr: number;
  equityMultiple: number;
  cashOnCash: number;
  yieldRate: number;
  occupancy: number;
  equityInvested: number;
  acquisitionCost: number;
  capitalImprovements: number;
  adjustedBasis: number;
  timeline: TimelineEntry[];
  // Office-specific
  leases?: LeaseEntry[];
  camSummary?: { category: string; amount: number }[];
  // Multifamily-specific
  rentRoll?: RentRollEntry[];
  avgRentTrend?: { month: string; avgRent: number }[];
  // Hospitality-specific
  hospitalityMetrics?: HospitalityMetrics;
}

export interface Portfolio {
  totalValue: number;
  noi: number;
  irr: number;
  occupancy: number;
  equityInvested: number;
  timeline: TimelineEntry[];
}

function generateTimeline(years: number, baseValue: number, baseNoi: number, baseCashFlow: number): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  const startYear = 2026 - years;
  for (let y = startYear; y <= 2025; y++) {
    for (let q = 1; q <= 4; q++) {
      const idx = (y - startYear) * 4 + q;
      const growth = 1 + idx * 0.008 + (Math.sin(idx * 0.5) * 0.01);
      entries.push({
        date: `Q${q} ${y}`,
        portfolioValue: Math.round(baseValue * growth),
        noi: Math.round(baseNoi * (1 + idx * 0.005)),
        cashFlow: Math.round(baseCashFlow * (1 + idx * 0.006 + Math.sin(idx) * 0.02)),
        irr: parseFloat((0.10 + idx * 0.002 + Math.sin(idx * 0.3) * 0.005).toFixed(3)),
      });
    }
  }
  return entries;
}

export const assets: Asset[] = [
  {
    id: "asset_1",
    name: "River North Office Tower",
    type: "office",
    market: "Chicago, IL",
    acquisitionDate: "2019-03-15",
    purchasePrice: 42000000,
    currentValue: 48500000,
    noi: 3600000,
    cashFlow: 2100000,
    capRate: 0.074,
    irr: 0.162,
    equityMultiple: 2.1,
    cashOnCash: 0.085,
    yieldRate: 0.072,
    occupancy: 0.94,
    equityInvested: 16800000,
    acquisitionCost: 42000000,
    capitalImprovements: 3200000,
    adjustedBasis: 45200000,
    timeline: generateTimeline(5, 42000000, 3200000, 1800000),
    leases: [
      { tenant: "Kirkland & Ellis LLP", leaseStart: "2020-01-01", leaseEnd: "2030-12-31", rent: 52, escalation: "3% annual", tiLcCosts: 850000 },
      { tenant: "Northern Trust Corp", leaseStart: "2019-06-01", leaseEnd: "2027-05-31", rent: 48, escalation: "2.5% annual", tiLcCosts: 620000 },
      { tenant: "Morningstar Inc", leaseStart: "2021-03-01", leaseEnd: "2029-02-28", rent: 45, escalation: "3% annual", tiLcCosts: 410000 },
      { tenant: "Huron Consulting", leaseStart: "2022-01-01", leaseEnd: "2028-12-31", rent: 42, escalation: "2% annual", tiLcCosts: 280000 },
      { tenant: "Grant Thornton LLP", leaseStart: "2020-09-01", leaseEnd: "2026-08-31", rent: 46, escalation: "2.5% annual", tiLcCosts: 350000 },
    ],
    camSummary: [
      { category: "Property Management", amount: 480000 },
      { category: "Insurance", amount: 210000 },
      { category: "Utilities", amount: 390000 },
      { category: "Maintenance & Repairs", amount: 310000 },
      { category: "Property Tax", amount: 620000 },
    ],
  },
  {
    id: "asset_2",
    name: "Lincoln Park Residences",
    type: "multifamily",
    market: "Chicago, IL",
    acquisitionDate: "2020-08-01",
    purchasePrice: 28000000,
    currentValue: 34200000,
    noi: 2400000,
    cashFlow: 1500000,
    capRate: 0.070,
    irr: 0.185,
    equityMultiple: 1.9,
    cashOnCash: 0.092,
    yieldRate: 0.068,
    occupancy: 0.96,
    equityInvested: 11200000,
    acquisitionCost: 28000000,
    capitalImprovements: 1800000,
    adjustedBasis: 29800000,
    timeline: generateTimeline(4, 28000000, 2100000, 1200000),
    rentRoll: [
      { unit: "101", rent: 2850, leaseStatus: "Occupied", tenant: "Johnson, M." },
      { unit: "102", rent: 2700, leaseStatus: "Occupied", tenant: "Chen, L." },
      { unit: "103", rent: 3100, leaseStatus: "Occupied", tenant: "Williams, R." },
      { unit: "201", rent: 2950, leaseStatus: "Occupied", tenant: "Garcia, S." },
      { unit: "202", rent: 2800, leaseStatus: "Notice", tenant: "Brown, A." },
      { unit: "203", rent: 3200, leaseStatus: "Occupied", tenant: "Kim, J." },
      { unit: "301", rent: 3400, leaseStatus: "Occupied", tenant: "Davis, T." },
      { unit: "302", rent: 3100, leaseStatus: "Vacant", tenant: "—" },
      { unit: "303", rent: 3500, leaseStatus: "Occupied", tenant: "Martinez, E." },
      { unit: "401", rent: 3800, leaseStatus: "Occupied", tenant: "Anderson, K." },
      { unit: "402", rent: 3600, leaseStatus: "Occupied", tenant: "Taylor, P." },
      { unit: "403", rent: 4200, leaseStatus: "Occupied", tenant: "Thomas, V." },
    ],
    avgRentTrend: [
      { month: "Jan 2024", avgRent: 3050 },
      { month: "Feb 2024", avgRent: 3060 },
      { month: "Mar 2024", avgRent: 3080 },
      { month: "Apr 2024", avgRent: 3100 },
      { month: "May 2024", avgRent: 3120 },
      { month: "Jun 2024", avgRent: 3150 },
      { month: "Jul 2024", avgRent: 3180 },
      { month: "Aug 2024", avgRent: 3200 },
      { month: "Sep 2024", avgRent: 3210 },
      { month: "Oct 2024", avgRent: 3230 },
      { month: "Nov 2024", avgRent: 3250 },
      { month: "Dec 2024", avgRent: 3270 },
    ],
  },
  {
    id: "asset_3",
    name: "Streeterville Hotel & Suites",
    type: "hospitality",
    market: "Chicago, IL",
    acquisitionDate: "2021-01-15",
    purchasePrice: 35000000,
    currentValue: 38800000,
    noi: 2800000,
    cashFlow: 1600000,
    capRate: 0.072,
    irr: 0.141,
    equityMultiple: 1.7,
    cashOnCash: 0.076,
    yieldRate: 0.065,
    occupancy: 0.82,
    equityInvested: 14000000,
    acquisitionCost: 35000000,
    capitalImprovements: 2400000,
    adjustedBasis: 37400000,
    timeline: generateTimeline(4, 35000000, 2500000, 1400000),
    hospitalityMetrics: {
      adr: 289,
      revpar: 237,
      occupancy: 0.82,
      revenueTrend: [
        { month: "Jan 2024", revenue: 1800000 },
        { month: "Feb 2024", revenue: 1650000 },
        { month: "Mar 2024", revenue: 2100000 },
        { month: "Apr 2024", revenue: 2400000 },
        { month: "May 2024", revenue: 2800000 },
        { month: "Jun 2024", revenue: 3200000 },
        { month: "Jul 2024", revenue: 3500000 },
        { month: "Aug 2024", revenue: 3400000 },
        { month: "Sep 2024", revenue: 2900000 },
        { month: "Oct 2024", revenue: 2600000 },
        { month: "Nov 2024", revenue: 2100000 },
        { month: "Dec 2024", revenue: 2300000 },
      ],
    },
  },
  {
    id: "asset_4",
    name: "West Loop Tech Center",
    type: "office",
    market: "Chicago, IL",
    acquisitionDate: "2018-06-01",
    purchasePrice: 22000000,
    currentValue: 26100000,
    noi: 1900000,
    cashFlow: 1100000,
    capRate: 0.073,
    irr: 0.138,
    equityMultiple: 1.8,
    cashOnCash: 0.079,
    yieldRate: 0.069,
    occupancy: 0.91,
    equityInvested: 8800000,
    acquisitionCost: 22000000,
    capitalImprovements: 1500000,
    adjustedBasis: 23500000,
    timeline: generateTimeline(5, 22000000, 1600000, 900000),
    leases: [
      { tenant: "Tempus Labs", leaseStart: "2019-01-01", leaseEnd: "2026-12-31", rent: 38, escalation: "3% annual", tiLcCosts: 420000 },
      { tenant: "Sprout Social", leaseStart: "2020-04-01", leaseEnd: "2028-03-31", rent: 41, escalation: "2.5% annual", tiLcCosts: 350000 },
      { tenant: "Avant LLC", leaseStart: "2021-07-01", leaseEnd: "2027-06-30", rent: 36, escalation: "2% annual", tiLcCosts: 280000 },
    ],
    camSummary: [
      { category: "Property Management", amount: 260000 },
      { category: "Insurance", amount: 130000 },
      { category: "Utilities", amount: 220000 },
      { category: "Maintenance & Repairs", amount: 180000 },
      { category: "Property Tax", amount: 340000 },
    ],
  },
  {
    id: "asset_5",
    name: "Lakeshore Apartments",
    type: "multifamily",
    market: "Evanston, IL",
    acquisitionDate: "2022-02-01",
    purchasePrice: 18000000,
    currentValue: 20400000,
    noi: 1500000,
    cashFlow: 900000,
    capRate: 0.074,
    irr: 0.128,
    equityMultiple: 1.5,
    cashOnCash: 0.072,
    yieldRate: 0.063,
    occupancy: 0.93,
    equityInvested: 7200000,
    acquisitionCost: 18000000,
    capitalImprovements: 950000,
    adjustedBasis: 18950000,
    timeline: generateTimeline(3, 18000000, 1300000, 750000),
    rentRoll: [
      { unit: "1A", rent: 1850, leaseStatus: "Occupied", tenant: "Patel, R." },
      { unit: "1B", rent: 1900, leaseStatus: "Occupied", tenant: "Lee, S." },
      { unit: "2A", rent: 2100, leaseStatus: "Occupied", tenant: "O'Brien, M." },
      { unit: "2B", rent: 2050, leaseStatus: "Vacant", tenant: "—" },
      { unit: "3A", rent: 2200, leaseStatus: "Occupied", tenant: "Nguyen, T." },
      { unit: "3B", rent: 2150, leaseStatus: "Occupied", tenant: "Hall, D." },
      { unit: "4A", rent: 2400, leaseStatus: "Notice", tenant: "Clark, J." },
      { unit: "4B", rent: 2350, leaseStatus: "Occupied", tenant: "Rivera, A." },
    ],
    avgRentTrend: [
      { month: "Jan 2024", avgRent: 2050 },
      { month: "Feb 2024", avgRent: 2060 },
      { month: "Mar 2024", avgRent: 2070 },
      { month: "Apr 2024", avgRent: 2090 },
      { month: "May 2024", avgRent: 2110 },
      { month: "Jun 2024", avgRent: 2130 },
      { month: "Jul 2024", avgRent: 2140 },
      { month: "Aug 2024", avgRent: 2160 },
      { month: "Sep 2024", avgRent: 2170 },
      { month: "Oct 2024", avgRent: 2180 },
      { month: "Nov 2024", avgRent: 2190 },
      { month: "Dec 2024", avgRent: 2200 },
    ],
  },
];

export const portfolio: Portfolio = {
  totalValue: assets.reduce((sum, a) => sum + a.currentValue, 0),
  noi: assets.reduce((sum, a) => sum + a.noi, 0),
  irr: 0.148,
  occupancy: 0.91,
  equityInvested: assets.reduce((sum, a) => sum + a.equityInvested, 0),
  timeline: generateTimeline(5, 125000000, 9200000, 6500000),
};

export function getAsset(id: string): Asset | undefined {
  return assets.find((a) => a.id === id);
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatFullCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}
