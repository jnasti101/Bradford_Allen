import type { IncomeStatementEntry, CashFlowStatementEntry, LeaseEntry, RentRollEntry } from "./data";

function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function formatNum(n: number): string {
  return n.toLocaleString("en-US");
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function exportIncomeStatement(assetName: string, data: IncomeStatementEntry[]) {
  const periods = data.map((d) => d.period);
  const rows = [
    ["", ...periods],
    ["REVENUE"],
    ["Base Rental Income", ...data.map((d) => formatNum(d.baseRentalIncome))],
    ["Tenant Reimbursements", ...data.map((d) => formatNum(d.tenantReimbursements))],
    ["Parking Income", ...data.map((d) => formatNum(d.parkingIncome))],
    ["Other Income", ...data.map((d) => formatNum(d.otherIncome))],
    ["Less: Vacancy & Credit Loss", ...data.map((d) => formatNum(d.vacancyLoss))],
    ["Effective Gross Income", ...data.map((d) => formatNum(d.effectiveGrossIncome))],
    [""],
    ["OPERATING EXPENSES"],
    ["Property Management", ...data.map((d) => formatNum(d.propertyManagement))],
    ["Insurance", ...data.map((d) => formatNum(d.insurance))],
    ["Utilities", ...data.map((d) => formatNum(d.utilities))],
    ["Repairs & Maintenance", ...data.map((d) => formatNum(d.repairsAndMaintenance))],
    ["Property Taxes", ...data.map((d) => formatNum(d.propertyTaxes))],
    ["General & Administrative", ...data.map((d) => formatNum(d.generalAndAdmin))],
    ["Total Operating Expenses", ...data.map((d) => formatNum(d.totalOperatingExpenses))],
    [""],
    ["Net Operating Income", ...data.map((d) => formatNum(d.netOperatingIncome))],
    ["Debt Service", ...data.map((d) => formatNum(d.debtService))],
    ["Capital Reserves", ...data.map((d) => formatNum(d.capitalReserves))],
    ["Net Income", ...data.map((d) => formatNum(d.netIncome))],
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  downloadCSV(`${slugify(assetName)}-income-statement.csv`, csv);
}

export function exportCashFlowStatement(assetName: string, data: CashFlowStatementEntry[]) {
  const periods = data.map((d) => d.period);
  const rows = [
    ["", ...periods],
    ["OPERATING ACTIVITIES"],
    ["Net Operating Income", ...data.map((d) => formatNum(d.netOperatingIncome))],
    ["Depreciation & Amortization", ...data.map((d) => formatNum(d.adjustmentsNonCash))],
    ["Changes in Working Capital", ...data.map((d) => formatNum(d.changesInWorkingCapital))],
    ["Net Cash from Operations", ...data.map((d) => formatNum(d.netCashFromOperations))],
    [""],
    ["INVESTING ACTIVITIES"],
    ["Capital Expenditures", ...data.map((d) => formatNum(d.capitalExpenditures))],
    ["Tenant Improvements", ...data.map((d) => formatNum(d.tenantImprovements))],
    ["Leasing Commissions", ...data.map((d) => formatNum(d.leasingCommissions))],
    ["Net Cash from Investing", ...data.map((d) => formatNum(d.netCashFromInvesting))],
    [""],
    ["FINANCING ACTIVITIES"],
    ["Mortgage Principal Payment", ...data.map((d) => formatNum(d.mortgagePrincipalPayment))],
    ["Distributions", ...data.map((d) => formatNum(d.distributions))],
    ["Net Cash from Financing", ...data.map((d) => formatNum(d.netCashFromFinancing))],
    [""],
    ["Net Cash Flow", ...data.map((d) => formatNum(d.netCashFlow))],
    ["Beginning Cash Balance", ...data.map((d) => formatNum(d.beginningCashBalance))],
    ["Ending Cash Balance", ...data.map((d) => formatNum(d.endingCashBalance))],
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  downloadCSV(`${slugify(assetName)}-cash-flow-statement.csv`, csv);
}

export function exportLeaseSchedule(assetName: string, data: LeaseEntry[]) {
  const rows = [
    ["Tenant", "Lease Start", "Lease End", "Rent ($/SF)", "Escalations", "TI/LC Costs"],
    ...data.map((l) => [
      `"${l.tenant}"`,
      l.leaseStart,
      l.leaseEnd,
      l.rent.toString(),
      `"${l.escalation}"`,
      formatNum(l.tiLcCosts),
    ]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  downloadCSV(`${slugify(assetName)}-lease-schedule.csv`, csv);
}

export function exportRentRoll(assetName: string, data: RentRollEntry[]) {
  const rows = [
    ["Unit", "Rent", "Lease Status", "Tenant"],
    ...data.map((r) => [
      r.unit,
      formatNum(r.rent),
      r.leaseStatus,
      `"${r.tenant}"`,
    ]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  downloadCSV(`${slugify(assetName)}-rent-roll.csv`, csv);
}
