/* =====================================================================
   Module 0 financial engine: pure functions, no DOM.
   Unit-tested in tests/unit/finance.test.cjs. Every lab uses these, so the
   numbers in the prose, the explorers and the tests agree.
   Conventions: rates are decimals (0.085 = 8.5%), periods are integers,
   cash flows at END of period unless stated.
   ===================================================================== */
(function (root) {
  "use strict";
  const F = {};

  /* ---------- Time value of money ---------- */
  F.simpleFV = (pv, r, n) => pv * (1 + r * n);
  F.fv = (pv, r, n) => pv * Math.pow(1 + r, n);
  F.pv = (fv, r, n) => fv / Math.pow(1 + r, n);
  /** Effective annual rate from a periodic rate */
  F.ear = (rPeriod, periodsPerYear) => Math.pow(1 + rPeriod, periodsPerYear) - 1;
  /** Periodic rate equivalent to an annual effective rate */
  F.periodic = (rAnnual, periodsPerYear) => Math.pow(1 + rAnnual, 1 / periodsPerYear) - 1;
  F.cagr = (start, end, years) => Math.pow(end / start, 1 / years) - 1;
  /** FV of a level contribution C per period for n periods at rate r (end of period) */
  F.fvAnnuity = (c, r, n) => (r === 0 ? c * n : (c * (Math.pow(1 + r, n) - 1)) / r);
  /** PV of a level payment C per period for n periods */
  F.pvAnnuity = (c, r, n) => (r === 0 ? c * n : (c * (1 - Math.pow(1 + r, -n))) / r);
  /** Contribution per period needed to reach fv */
  F.requiredContribution = (fv, r, n) => (r === 0 ? fv / n : (fv * r) / (Math.pow(1 + r, n) - 1));

  /**
   * Year-by-year growth with monthly contributions.
   * Returns rows {year, contributed, value, real} ; monthly compounding at the
   * monthly rate equivalent to the annual effective return.
   */
  F.growthPath = ({ principal, annualReturn, years, monthly = 0, inflation = 0, simple = false }) => {
    const rm = F.periodic(annualReturn, 12);
    const rows = [{ year: 0, contributed: principal, value: principal, real: principal, growth: 0 }];
    let value = principal, contributed = principal;
    let simpleInterestAcc = 0;
    for (let y = 1; y <= years; y++) {
      for (let mth = 0; mth < 12; mth++) {
        if (simple) {
          // simple interest: interest only on contributed capital, never reinvested
          simpleInterestAcc += contributed * rm;
          contributed += monthly;
          value = contributed + simpleInterestAcc;
        } else {
          value = value * (1 + rm) + monthly;
          contributed += monthly;
        }
      }
      rows.push({ year: y, contributed, value, real: value / Math.pow(1 + inflation, y), growth: value - contributed });
    }
    return rows;
  };

  /* ---------- Inflation ---------- */
  F.realReturn = (nominal, inflation) => (1 + nominal) / (1 + inflation) - 1;
  F.purchasingPower = (inflation, years) => 1 / Math.pow(1 + inflation, years);
  /** Cumulative price-level change from a list of annual inflation rates */
  F.cumulativeInflation = (rates) => rates.reduce((acc, r) => acc * (1 + r), 1) - 1;

  /* ---------- Cash flow & balance sheet ---------- */
  F.savingsRate = (takeHome, spending) => (takeHome - spending) / takeHome;
  /**
   * Lifestyle inflation: income grows g each year; a share s of each raise is spent.
   * Baseline: spending grows only with inflation pi.
   */
  F.lifestylePath = ({ income, spending, raise, shareSpent, inflation, years }) => {
    const out = [];
    let inc = income, sp = spending, base = spending, cum = 0, cumBase = 0;
    for (let y = 0; y <= years; y++) {
      if (y > 0) {
        const raiseAmt = inc * raise;
        inc += raiseAmt;
        sp += raiseAmt * shareSpent;
        base *= 1 + inflation;
      }
      cum += (inc - sp) * 12; cumBase += (inc - Math.min(base, inc)) * 12;
      out.push({ year: y, income: inc, spending: sp, rate: (inc - sp) / inc, baseRate: (inc - base) / inc, cum, cumBase });
    }
    return out;
  };
  F.netWorth = (assets, liabilities) => assets - liabilities;
  F.leverage = (assets, liabilities) => assets / (assets - liabilities);
  /** % change in equity for a % change in asset value, given a fixed debt */
  F.equityChange = (assets, debt, assetMove) => {
    const e0 = assets - debt, e1 = assets * (1 + assetMove) - debt;
    return { e0, e1, pct: e0 > 0 ? e1 / e0 - 1 : NaN };
  };

  /* ---------- Debt ---------- */
  F.emi = (principal, annualRate, months) => {
    const i = annualRate / 12;
    if (i === 0) return principal / months;
    const f = Math.pow(1 + i, months);
    return (principal * i * f) / (f - 1);
  };
  /**
   * Amortisation schedule with optional one-off prepayment.
   * prepay: {month, amount, mode: "tenure"|"emi"}
   */
  F.schedule = (principal, annualRate, months, prepay) => {
    const i = annualRate / 12;
    let emi = F.emi(principal, annualRate, months);
    let bal = principal, m = 0, totalInterest = 0;
    const rows = [];
    while (bal > 0.005 && m < 1200) {
      m++;
      const interest = bal * i;
      let princ = Math.min(emi - interest, bal);
      bal -= princ; totalInterest += interest;
      let extra = 0;
      if (prepay && m === prepay.month && prepay.amount > 0) {
        extra = Math.min(prepay.amount, bal); bal -= extra;
        if (prepay.mode === "emi" && bal > 0.005) emi = F.emi(bal, annualRate, months - m);
      }
      rows.push({ month: m, interest, principal: princ, extra, balance: Math.max(0, bal), emi });
    }
    return { rows, months: m, totalInterest, firstEmi: F.emi(principal, annualRate, months) };
  };
  /** Aggregate a monthly schedule into years */
  F.byYear = (rows) => {
    const out = [];
    rows.forEach((r) => {
      const y = Math.ceil(r.month / 12);
      out[y - 1] = out[y - 1] || { year: y, interest: 0, principal: 0, balance: 0 };
      out[y - 1].interest += r.interest; out[y - 1].principal += r.principal + r.extra; out[y - 1].balance = r.balance;
    });
    return out;
  };
  /** Reducing-balance annual rate equivalent to a flat-rate loan */
  F.flatToReducing = (flatRate, years) => {
    const months = years * 12, P = 1;
    const emi = (P + P * flatRate * years) / months;
    let lo = 0, hi = 2;
    for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (F.emi(P, mid, months) > emi) hi = mid; else lo = mid; }
    return (lo + hi) / 2;
  };
  /**
   * Credit card paying only the minimum due each month.
   * monthlyRate on revolving balance; minimum = max(minPct * balance, floor), capped at balance.
   */
  F.minimumDue = ({ balance, monthlyRate, minPct, floor = 500, fixedPayment = 0 }) => {
    let b = balance, m = 0, interest = 0; const path = [b];
    while (b > 0.5 && m < 720) {
      m++;
      const it = b * monthlyRate; b += it; interest += it;
      let pay = fixedPayment > 0 ? fixedPayment : Math.max(b * minPct, floor);
      pay = Math.min(pay, b); b -= pay;
      path.push(b);
    }
    return { months: b > 0.5 ? Infinity : m, interest, path };
  };
  F.refinance = ({ balance, monthsLeft, oldRate, newRate, cost }) => {
    const e1 = F.emi(balance, oldRate, monthsLeft), e2 = F.emi(balance, newRate, monthsLeft);
    const saving = e1 - e2;
    return { oldEmi: e1, newEmi: e2, monthlySaving: saving, totalSaving: saving * monthsLeft - cost, breakEvenMonths: saving > 0 ? cost / saving : Infinity };
  };

  /* ---------- Emergency fund ---------- */
  F.emergencyTarget = ({ essentials, stability, dependants, healthCover, otherIncome }) => {
    // Teaching heuristic: base months by income stability, adjusted for circumstances.
    const baseMonths = { stable: 4, average: 6, variable: 9 }[stability] || 6;
    let months = baseMonths + (dependants > 0 ? Math.min(3, dependants) : 0) + (healthCover ? 0 : 2) - (otherIncome ? 1.5 : 0);
    months = Math.max(3, Math.min(12, months));
    return { months, low: essentials * Math.max(3, months - 1.5), mid: essentials * months, high: essentials * (months + 1.5) };
  };
  F.runway = (buffer, monthlyOutflow, monthlyIncomeDuringShock = 0) => {
    const burn = monthlyOutflow - monthlyIncomeDuringShock;
    return burn <= 0 ? Infinity : buffer / burn;
  };

  /* ---------- Insurance ---------- */
  /** Deterministic pseudo-random generator so simulations are reproducible */
  F.rng = (seed) => { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; };
  /**
   * Risk pooling: `households` each face probability p of loss L in a year, for `years` years.
   * Returns per-household total cost uninsured vs insured (premium = p*L*(1+loading)).
   */
  F.poolSim = ({ households, p, loss, loading, years, seed = 7 }) => {
    const r = F.rng(seed);
    const premium = p * loss * (1 + loading);
    const alone = [];
    for (let h = 0; h < households; h++) {
      let cost = 0;
      for (let y = 0; y < years; y++) if (r() < p) cost += loss;
      alone.push(cost);
    }
    const insured = premium * years;
    const worst = Math.max(...alone), mean = alone.reduce((a, b) => a + b, 0) / households;
    const hit = alone.filter((c) => c > 0).length;
    return { alone, insured, premium, worst, mean, hit, expected: p * loss * years };
  };
  /** Needs-based life cover: PV of household expenses (real) + debts + goals − assets − existing cover */
  F.lifeCoverNeed = ({ annualExpenses, years, realRate, debts, goals, assets, existingCover }) => {
    const pvExp = F.pvAnnuity(annualExpenses, realRate, years);
    const need = pvExp + debts + goals - assets - existingCover;
    return { pvExp, need: Math.max(0, need), gross: pvExp + debts + goals };
  };
  /** IRR of a series of cash flows at t = 0..n (annual) by bisection */
  F.irr = (flows) => {
    const npv = (r) => flows.reduce((s, c, t) => s + c / Math.pow(1 + r, t), 0);
    let lo = -0.99, hi = 1;
    if (npv(lo) * npv(hi) > 0) return NaN;
    for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (npv(lo) * npv(mid) <= 0) hi = mid; else lo = mid; }
    return (lo + hi) / 2;
  };

  /* ---------- Tax (India, new regime, tax year 2026-27; verified 29 Sep 2026) ---------- */
  F.TAX_2026_27 = {
    label: "New regime, tax year 2026-27",
    verified: "29 Sep 2026",
    slabs: [ [400000, 0], [800000, 0.05], [1200000, 0.10], [1600000, 0.15], [2000000, 0.20], [2400000, 0.25], [Infinity, 0.30] ],
    rebateLimit: 1200000, // total income up to this: tax nil (rebate)
    standardDeduction: 75000,
    cess: 0.04,
  };
  /** Tax before rebate on taxable income, with per-slab breakdown */
  F.slabTax = (taxable, rules = F.TAX_2026_27) => {
    let prev = 0, tax = 0; const parts = [];
    for (const [top, rate] of rules.slabs) {
      const inSlab = Math.max(0, Math.min(taxable, top) - prev);
      parts.push({ from: prev, to: top, rate, amount: inSlab, tax: inSlab * rate });
      tax += inSlab * rate; prev = top;
      if (taxable <= top) break;
    }
    return { tax, parts };
  };
  /**
   * Simplified liability: slabs → rebate (with marginal relief just above the limit) → 4% cess.
   * Excludes surcharge (income > ₹50 lakh), special-rate income and deductions other than
   * the salaried standard deduction. For teaching only.
   */
  F.incomeTax = (gross, { salaried = true } = {}, rules = F.TAX_2026_27) => {
    const taxable = Math.max(0, gross - (salaried ? rules.standardDeduction : 0));
    const { tax: before, parts } = F.slabTax(taxable, rules);
    let afterRebate = before;
    if (taxable <= rules.rebateLimit) afterRebate = 0;
    else afterRebate = Math.min(before, taxable - rules.rebateLimit); // marginal relief
    const cess = afterRebate * rules.cess;
    const total = afterRebate + cess;
    return { gross, taxable, before, afterRebate, cess, total, parts, average: gross > 0 ? total / gross : 0 };
  };
  F.marginalRate = (gross, opts, rules) => {
    const d = 1000;
    return (F.incomeTax(gross + d, opts, rules).total - F.incomeTax(gross, opts, rules).total) / d;
  };
  F.afterTax = (r, t) => r * (1 - t);
  /** Value after n years when returns are taxed every year vs taxed once at the end */
  F.taxDrag = (pv, r, t, n) => ({
    annual: pv * Math.pow(1 + r * (1 - t), n),
    deferred: pv + (pv * Math.pow(1 + r, n) - pv) * (1 - t),
    untaxed: pv * Math.pow(1 + r, n),
  });

  /* ---------- Ponzi ---------- */
  /**
   * Monthly cash balance of a scheme that invests nothing.
   * startInvestors each bring `ticket`; new investors grow at `growth` per month
   * (a fraction of the current base) until the new-money pool dries up (`saturation` months),
   * after which inflows decay. Promised monthly return paid to every investor;
   * operator skims `skim` of inflows.
   */
  F.ponzi = ({ ticket = 100000, startInvestors = 200, promised = 0.03, growth = 0.08, saturation = 24, skim = 0.1, withdrawRate = 0.01, months = 60 }) => {
    let investors = startInvestors, owed = investors * ticket, cash = investors * ticket * (1 - skim);
    const path = [{ month: 0, cash, owed, investors, inflow: investors * ticket, payout: 0 }];
    let collapse = null;
    for (let m = 1; m <= months; m++) {
      const g = m <= saturation ? growth : growth * Math.pow(0.8, m - saturation) - 0.02;
      const newInv = Math.max(0, Math.round(investors * g));
      const inflow = newInv * ticket;
      investors += newInv;
      owed += inflow;
      const payout = owed * promised;           // "returns" paid out in cash
      const redemptions = owed * withdrawRate;  // principal some investors ask back
      owed = owed - redemptions;                // promised balances (principal credited)
      cash += inflow * (1 - skim) - payout - redemptions;
      path.push({ month: m, cash, owed, investors, inflow, payout: payout + redemptions });
      if (cash < 0 && collapse == null) { collapse = m; break; }
    }
    return { path, collapse };
  };

  if (typeof module !== "undefined" && module.exports) module.exports = F;
  else root.FIN = F;
})(typeof window !== "undefined" ? window : globalThis);
