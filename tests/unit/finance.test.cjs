// Unit tests for Module 00's deterministic finance engine.
const F = require("../../src/modules/module-00/scripts/finance.js");
let pass = 0, fail = 0;
function near(name, got, want, tol = 0.5) {
  const ok = Math.abs(got - want) <= tol;
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}: got ${got}, want ${want} ±${tol}`);
}
// TVM
near("FV 1L 12% 10y", F.fv(1e5, 0.12, 10), 310585, 1);
near("FV 1L 12% 30y", F.fv(1e5, 0.12, 30), 2995992, 1);
near("Simple 1L 12% 30y", F.simpleFV(1e5, 0.12, 30), 460000, 0.01);
near("PV 10L 7% 8y", F.pv(10e5, 0.07, 8), 582009, 1);
near("CAGR 2L->3.4L 5y", F.cagr(2e5, 3.4e5, 5), 0.11196, 0.0001);
near("EAR 1%/m", F.ear(0.01, 12), 0.126825, 0.00001);
near("EAR 3.5%/m", F.ear(0.035, 12), 0.511069, 0.00001);
near("FV annuity identity", F.fvAnnuity(1000, 0.01, 12), 12682.5, 0.1);
near("PV annuity vs EMI", F.pvAnnuity(F.emi(50e5, 0.085, 240), 0.085 / 12, 240), 50e5, 0.5);
// growthPath: no contributions equals fv at annual effective rate
const gp = F.growthPath({ principal: 1e5, annualReturn: 0.12, years: 10 });
near("growthPath matches FV", gp[10].value, 310585, 1);
const gps = F.growthPath({ principal: 1e5, annualReturn: 0.12, years: 30, simple: true });
near("growthPath simple (monthly-equivalent, lower than 12% flat)", gps[30].value, 1e5 * (1 + F.periodic(0.12, 12) * 360), 1);
// Inflation
near("Real 7% / 5%", F.realReturn(0.07, 0.05), 0.019048, 0.00001);
near("Real 20% / 15%", F.realReturn(0.2, 0.15), 0.043478, 0.00001);
near("Cum CPI 2014-20", F.cumulativeInflation([0.059, 0.049, 0.045, 0.036, 0.034, 0.048]), 0.30325, 0.0001);
// Goals
const Fg = 20e5 * Math.pow(1.08, 15), rm = F.periodic(0.10, 12);
near("Education corpus", Fg, 6344338, 1);
near("SIP 180m", F.requiredContribution(Fg, rm, 180), 15922.8, 0.5);
near("SIP 120m", F.requiredContribution(Fg, rm, 120), 31743.3, 0.5);
// Debt
near("EMI 50L 8.5% 240", F.emi(50e5, 0.085, 240), 43391.16, 0.01);
const base = F.schedule(50e5, 0.085, 240);
near("Total interest", base.totalInterest, 5413879, 2);
near("Schedule ends at 240", base.months, 240, 0);
near("Month-1 interest", base.rows[0].interest, 35416.67, 0.01);
near("Sum principal = P", base.rows.reduce((s, r) => s + r.principal + r.extra, 0), 50e5, 0.5);
const t = F.schedule(50e5, 0.085, 240, { month: 36, amount: 5e5, mode: "tenure" });
near("Prepay tenure months", t.months, 199, 0);
near("Prepay tenure interest", t.totalInterest, 4094240, 5);
const e = F.schedule(50e5, 0.085, 240, { month: 36, amount: 5e5, mode: "emi" });
near("Prepay EMI months", e.months, 240, 0);
near("Prepay EMI new EMI", e.rows[40].emi, 38749.7, 0.5);
near("Prepay EMI interest", e.totalInterest, 4967021, 5);
near("Flat 10% 3y -> reducing", F.flatToReducing(0.10, 3), 0.17918, 0.0002);
const card = F.minimumDue({ balance: 1e5, monthlyRate: 0.035, minPct: 0.05, floor: 500 });
near("Card months", card.months, 172, 0);
near("Card interest", card.interest, 195499, 5);
const refi = F.refinance({ balance: 40e5, monthsLeft: 204, oldRate: 0.0925, newRate: 0.084, cost: 15000 });
near("Refi saving/month", refi.monthlySaving, 2079.5, 0.5);
near("Refi breakeven", refi.breakEvenMonths, 7.21, 0.02);
// Balance sheet
near("Equity change 10% on 80% LTV", F.equityChange(1e7, 8e6, -0.1).pct, -0.5, 1e-9);
// Insurance
near("Endowment IRR", F.irr([...Array(20).fill(-1e5), 0].map((c, i) => (i === 20 ? 30e5 : c))), 0.03719, 0.0001);
const ps = F.poolSim({ households: 1000, p: 0.01, loss: 10e5, loading: 0.3, years: 1 });
near("Pool premium", ps.premium, 13000, 0.01);
// Tax
const meera = F.incomeTax(15e5);
near("Meera taxable", meera.taxable, 14.25e5, 0);
near("Meera tax before cess", meera.afterRebate, 93750, 0.01);
near("Meera total", meera.total, 97500, 0.01);
near("Meera marginal", F.marginalRate(15e5), 0.156, 0.0001);
near("Nil at 12.75L", F.incomeTax(12.75e5).total, 0, 0.01);
near("Marginal relief 12.85L", F.incomeTax(12.85e5).afterRebate, 10000, 0.01);
near("No relief far above (20L)", F.incomeTax(20e5).afterRebate, F.slabTax(19.25e5).tax, 0.01);
near("After-tax FD 7% at 15.6%", F.afterTax(0.07, 0.156), 0.05908, 0.00001);
// Ponzi collapses
const pz = F.ponzi({});
console.log("Ponzi default collapse month:", pz.collapse);
if (pz.collapse == null) { fail++; console.log("FAIL ponzi should collapse"); } else pass++;
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
