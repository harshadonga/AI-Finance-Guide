/* =====================================================================
   Module 0 interactive explorers ("labs").
   Each lab: read controls -> compute with FIN (finance.js) -> render
   readouts, chart and a one-sentence insight. Labs initialise the first
   time their lesson is shown, so charts measure a visible container.
   ===================================================================== */
(function () {
  "use strict";
  const { fmt, $, $$ } = FA;
  const F = window.FIN;
  const pct = (v, dp = 1) => fmt.pct(v, dp);

  /* ---------- helpers ---------- */
  function ranges(root, spec, onChange) {
    // spec: { id: formatter }
    const vals = {};
    Object.entries(spec).forEach(([id, f]) => {
      const inp = $("#" + id, root), out = $("#" + id + "-o", root);
      const read = () => { vals[id] = +inp.value; if (out) out.textContent = f(+inp.value); };
      read();
      inp.addEventListener("input", () => { read(); onChange(vals); });
    });
    return vals;
  }
  function seg(root, attr, onChange) {
    const btns = $$(`[data-${attr}]`, root);
    let value = (btns.find((b) => b.getAttribute("aria-pressed") === "true") || btns[0]).dataset[attr];
    btns.forEach((b) => b.addEventListener("click", () => {
      btns.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
      value = b.dataset[attr]; onChange(value);
    }));
    return () => value;
  }
  const set = (root, id, html) => { const el = $("#" + id, root); if (el) el.innerHTML = html; };
  const money = (v) => fmt.inrShort(v);
  const rupee = (v) => fmt.inr(v);
  const pctIn = (v) => `${fmt.num(v, v % 1 ? 1 : 0)}%`;
  const years = (v) => `${v} yr`;

  const LABS = {};

  /* ---------- 0.1 Bathtub ---------- */
  LABS.bathtub = function (root) {
    const chart = FA.chart($("#bt-chart", root), {
      title: "Wealth built from saving alone", desc: "Cumulative saving over time with no investment returns.",
      series: [{ name: "Wealth", color: "--series-1", kind: "area", values: [] }],
      x: { values: [], label: "Years from now", fmt: (v) => String(v) },
      y: { fmt: fmt.inrAxis, min: 0 }, tipFmt: money, tipTitle: (x) => `End of year ${x}`, tableFmt: rupee,
    });
    let view = "nominal";
    const getView = seg(root, "view", (v) => { view = v; draw(); });
    const v = ranges(root, { "bt-inc": rupee, "bt-sp": rupee, "bt-gi": pctIn, "bt-gs": pctIn, "bt-yr": years }, draw);
    function draw() {
      const n = v["bt-yr"], gi = v["bt-gi"] / 100, gs = v["bt-gs"] / 100, infl = 0.05;
      let inc = v["bt-inc"], sp = v["bt-sp"], w = 0, peak = 0, peakYear = 0, firstNeg = null;
      const xs = [0], ws = [0];
      const r1 = (inc - sp) / inc;
      let rn = r1;
      for (let y = 1; y <= n; y++) {
        w += (inc - sp) * 12;
        rn = (inc - sp) / inc;
        if (inc - sp < 0 && firstNeg == null) firstNeg = y;
        const shown = view === "real" ? w / Math.pow(1 + infl, y) : w;
        xs.push(y); ws.push(shown);
        if (shown > peak) { peak = shown; peakYear = y; }
        inc *= 1 + gi; sp *= 1 + gs;
      }
      chart.update({ x: { values: xs, label: "Years from now", fmt: (x) => String(x) }, series: [{ name: view === "real" ? "Wealth in today’s rupees" : "Wealth", color: "--series-1", kind: "area", values: ws }], y: { fmt: fmt.inrAxis, min: Math.min(0, ...ws) } });
      const end = ws[ws.length - 1];
      set(root, "bt-w", money(end));
      set(root, "bt-w-sub", view === "real" ? "in today’s rupees" : "in rupees of that year");
      set(root, "bt-r1", pct(r1));
      set(root, "bt-rn", pct(rn));
      $("#bt-rn", root).closest(".readout").classList.toggle("is-neg", rn < 0);
      let msg;
      if (r1 <= 0) msg = `Spending starts at or above income, so the tub never fills. Every month drains wealth.`;
      else if (firstNeg) msg = `Spending growth overtakes income growth: from <b>year ${firstNeg}</b> you spend more than you earn, and wealth peaks at <b>${money(peak)}</b> in year ${peakYear} before falling.`;
      else if (gs > gi) msg = `Spending is growing faster than income, so the savings rate shrinks from <b>${pct(r1)}</b> to <b>${pct(rn)}</b>. The tub is still filling, but more slowly each year.`;
      else msg = `Income grows at least as fast as spending, so the savings rate holds or rises (<b>${pct(r1)}</b> to <b>${pct(rn)}</b>) and wealth accelerates even with no investment returns.`;
      set(root, "bt-insight", msg);
    }
    draw();
  };

  /* ---------- 0.2 Waterfall (static, drawn to scale) ---------- */
  LABS.waterfall = function (root) {
    const steps = [
      ["Gross salary", 125000, "total"],
      ["Income tax (TDS)", -8125, "out"],
      ["Employee EPF (saved for later)", -6000, "save"],
      ["Professional tax and other", -875, "out"],
      ["Take-home", null, "total"],
      ["Fixed costs", -37500, "out"],
      ["Necessary variable costs", -17500, "out"],
      ["Free cash flow", null, "total"],
      ["Discretionary spending", -20000, "out"],
      ["Credit-card interest", -3000, "out"],
      ["Saving", null, "total-save"],
    ];
    const max = 125000; let level = 0; let html = "";
    steps.forEach(([label, v, kind]) => {
      let from, to, shown;
      if (kind.startsWith("total")) { if (v != null) level = v; from = 0; to = level; shown = level; }
      else { from = level + v; to = level; level += v; shown = v; }
      const left = (from / max) * 100, width = Math.max(0.4, ((to - from) / max) * 100);
      const cls = kind === "out" ? "wf-bar--out" : kind === "save" ? "wf-bar--save" : kind === "total-save" ? "wf-bar--savetotal" : "wf-bar--total";
      html += `<div class="wf-row${kind.startsWith("total") ? " wf-row--total" : ""}" role="row"><span class="wf-l" role="rowheader">${label}</span>
        <span class="wf-track" role="cell" aria-hidden="true"><span class="wf-bar ${cls}" style="left:${left}%;width:${width}%"></span></span>
        <span class="wf-v" role="cell">${shown < 0 ? "−" : ""}${fmt.inr(Math.abs(shown))}</span></div>`;
    });
    $("#wf-rows", root).innerHTML = html;
  };

  /* ---------- 0.2 Lifestyle inflation ---------- */
  LABS.lifestyle = function (root) {
    const chart = FA.chart($("#ls-chart", root), {
      title: "Savings rate over time", desc: "Your savings rate compared with a baseline where spending grows only with inflation.",
      series: [], x: { values: [], label: "Years from now" }, y: { fmt: (v) => `${Math.round(v * 100)}%` }, tipFmt: (v) => pct(v), tipTitle: (x) => `Year ${x}`,
      refLine: { y: 0, label: "Spending = income" },
    });
    const v = ranges(root, { "ls-inc": rupee, "ls-sp": rupee, "ls-raise": pctIn, "ls-k": pctIn, "ls-yr": years }, draw);
    function draw() {
      const n = v["ls-yr"];
      const path = F.lifestylePath({ income: v["ls-inc"], spending: v["ls-sp"], raise: v["ls-raise"] / 100, shareSpent: v["ls-k"] / 100, inflation: 0.05, years: n });
      const xs = path.map((p) => p.year);
      chart.update({
        x: { values: xs, label: "Years from now" },
        series: [
          { name: "You", color: "--series-1", values: path.map((p) => p.rate) },
          { name: "Baseline: spending grows 5% a year", color: "--series-2", dashed: true, values: path.map((p) => p.baseRate) },
        ],
        y: { fmt: (x) => `${Math.round(x * 100)}%`, min: Math.min(0, ...path.map((p) => Math.min(p.rate, p.baseRate))), max: 1 },
      });
      const last = path[n], cum = path[n - 1].cum, cumB = path[n - 1].cumBase;
      set(root, "ls-rate", pct(last.rate));
      set(root, "ls-rate-sub", `from ${pct(path[0].rate)} today`);
      set(root, "ls-base", pct(last.baseRate));
      set(root, "ls-cum", `${money(cum)}`);
      set(root, "ls-cum-sub", `baseline ${money(cumB)} · gap ${money(cumB - cum)}`);
      $("#ls-rate", root).closest(".readout").classList.toggle("is-neg", last.rate < 0);
      const s0 = path[0].rate, k = v["ls-k"] / 100;
      let msg;
      if (s0 <= 0) msg = "You start with no saving, so every raise has to fund the gap first.";
      else if (k > 1 - s0 + 0.001) msg = `You spend ${Math.round(k * 100)}% of each raise, more than your current spending share of ${Math.round((1 - s0) * 100)}%, so your savings rate falls every year. Over ${n} years that costs <b>${money(cumB - cum)}</b> of saving against the baseline, before any investment returns.`;
      else if (k < 1 - s0 - 0.001) msg = `You keep ${Math.round((1 - k) * 100)}% of each raise, more than your current ${Math.round(s0 * 100)}% savings rate, so the rate climbs with every raise, reaching <b>${pct(last.rate)}</b>.`;
      else msg = "You spend exactly your current spending share of each raise, so the savings rate stays flat.";
      set(root, "ls-insight", msg);
    }
    draw();
  };

  /* ---------- 0.3 Leverage ---------- */
  LABS.leverage = function (root) {
    const chart = FA.chart($("#lv-chart", root), {
      type: "bars", title: "What you own, split into the lender’s claim and yours", desc: "Stacked columns of debt and equity before and after the price change.",
      series: [], x: { values: ["Before", "After"] }, y: { fmt: fmt.inrAxis, min: 0 }, tipFmt: money, height: 250,
    });
    const v = ranges(root, { "lv-a": money, "lv-ltv": pctIn, "lv-move": (x) => `${x > 0 ? "+" : ""}${x}%` }, draw);
    function draw() {
      const A = v["lv-a"], D = A * v["lv-ltv"] / 100, mv = v["lv-move"] / 100;
      const r = F.equityChange(A, D, mv);
      const L = A / (A - D);
      const A1 = A * (1 + mv);
      chart.update({ series: [
        { name: "Loan (lender’s claim)", color: "--series-2", stack: true, values: [D, Math.min(D, A1)] },
        { name: "Your equity", color: "--series-1", stack: true, values: [r.e0, Math.max(0, r.e1)] },
      ] });
      set(root, "lv-L", `${fmt.num(L, L < 10 ? 2 : 1)}×`);
      set(root, "lv-e", `${money(r.e0)} → ${money(r.e1)}`);
      set(root, "lv-pct", `${r.pct > 0 ? "+" : ""}${pct(r.pct, 0)}`);
      set(root, "lv-pct-sub", `asset moved ${mv > 0 ? "+" : ""}${pct(mv, 0)}`);
      const ro = $("#lv-pct", root).closest(".readout"); ro.classList.toggle("is-neg", r.pct < 0); ro.classList.toggle("is-pos", r.pct > 0);
      set(root, "lv-wipe", D > 0 ? `−${pct(1 / L, 1)}` : "never (no debt)");
      let msg;
      if (D === 0) msg = "No debt: your equity moves exactly as much as the asset. Leverage of 1.";
      else if (r.e1 < 0) msg = `The asset is now worth less than the loan. You have <b>negative equity of ${money(-r.e1)}</b>: selling would not repay the lender, and you still owe the difference.`;
      else if (mv < 0) msg = `A ${pct(-mv, 0)} fall in the asset removes <b>${pct(-r.pct, 0)}</b> of your equity, because the loan does not shrink. At ${fmt.num(L, 1)}× leverage, a fall of ${pct(1 / L, 1)} would wipe you out.`;
      else if (mv > 0) msg = `A ${pct(mv, 0)} rise becomes a <b>${pct(r.pct, 0)}</b> gain on your own money. The same lever works just as hard on the way down, and interest costs run every month either way.`;
      else msg = "Move the price to see how the loss or gain lands on your equity.";
      set(root, "lv-insight", msg);
    }
    draw();
  };

  /* ---------- 0.4 Compounding ---------- */
  LABS.compound = function (root) {
    const chart = FA.chart($("#cp-chart", root), {
      title: "Contributions vs growth", desc: "Stacked area of money contributed and growth earned, with the real value as a dashed line.",
      series: [], x: { values: [], label: "Years" }, y: { fmt: fmt.inrAxis, min: 0 }, tipFmt: money, tipTitle: (x) => `After ${x} year${x === 1 ? "" : "s"}`, tableFmt: rupee,
    });
    let mode = "compound";
    seg(root, "mode", (m) => { mode = m; draw(); });
    const v = ranges(root, { "cp-p": rupee, "cp-m": rupee, "cp-r": pctIn, "cp-n": years, "cp-i": pctIn }, draw);
    function draw() {
      const n = v["cp-n"];
      const rows = F.growthPath({ principal: v["cp-p"], annualReturn: v["cp-r"] / 100, years: n, monthly: v["cp-m"], inflation: v["cp-i"] / 100, simple: mode === "simple" });
      chart.update({
        x: { values: rows.map((r) => r.year), label: "Years" },
        series: [
          { name: "You put in", color: "--series-2", stack: true, values: rows.map((r) => r.contributed) },
          { name: mode === "simple" ? "Interest (not reinvested)" : "Growth", color: "--series-1", stack: true, values: rows.map((r) => Math.max(0, r.value - r.contributed)) },
          { name: "Total in today’s rupees", color: "--series-3", dashed: true, values: rows.map((r) => r.real) },
        ],
      });
      const last = rows[n];
      set(root, "cp-fv", money(last.value));
      set(root, "cp-fv-sub", `${money(last.real)} in today’s rupees`);
      set(root, "cp-in", money(last.contributed));
      const growth = last.value - last.contributed;
      set(root, "cp-g", money(growth));
      set(root, "cp-g-sub", last.value > 0 ? `${pct(growth / last.value, 0)} of the final value` : "");
      // share of growth earned in the final third of the period
      const k = Math.max(0, n - Math.round(n / 3));
      const gK = rows[k].value - rows[k].contributed;
      const lateShare = growth > 0 ? (growth - gK) / growth : 0;
      let msg;
      if (growth <= 0) msg = "With a 0% return nothing grows: the final value is exactly what you put in, and inflation shrinks it in real terms.";
      else if (mode === "simple") msg = `Paid-out interest never earns interest itself, so growth stays a straight-line add-on. Switch to reinvested to see the curve bend upward.`;
      else msg = `Growth makes up <b>${pct(growth / last.value, 0)}</b> of the final value, and <b>${pct(lateShare, 0)}</b> of all growth arrives in the last third of the period (the final ${n - k} years). That is why time is the strongest lever.`;
      set(root, "cp-insight", msg);
    }
    draw();
  };

  /* ---------- 0.4 Discounting dial ---------- */
  LABS.pvdial = function (root) {
    const chart = FA.chart($("#pv-chart", root), {
      title: "Present value by years until received", desc: "How the value today of the chosen future amount falls as it moves further away.",
      series: [], x: { values: [], label: "Years until received" }, y: { fmt: fmt.inrAxis, min: 0 }, tipFmt: money, tipTitle: (x) => `Received in ${x} years`, height: 230, tableEvery: 5,
    });
    const v = ranges(root, { "pv-f": money, "pv-n": years, "pv-r": pctIn }, draw);
    function draw() {
      const Fv = v["pv-f"], n = v["pv-n"], r = v["pv-r"] / 100;
      const xs = Array.from({ length: 41 }, (_, i) => i);
      chart.update({
        x: { values: xs, label: "Years until received" },
        series: [{ name: `Present value at ${pctIn(v["pv-r"])}`, color: "--series-1", kind: "area", values: xs.map((t) => F.pv(Fv, r, t)) }],
        annotations: [{ i: n, text: `${n} yr: ${money(F.pv(Fv, r, n))}` }],
      });
      const pv = F.pv(Fv, r, n);
      set(root, "pv-v", money(pv));
      set(root, "pv-v-sub", `${pct(pv / Fv, 0)} of the future amount`);
      set(root, "pv-df", fmt.num(1 / Math.pow(1 + r, n), 3));
      const half = Math.log(2) / Math.log(1 + r);
      set(root, "pv-insight", `At ${pctIn(v["pv-r"])}, money received about <b>${fmt.num(half, 1)} years</b> from now is worth half its face value today. Raise the rate or push the date out and future money shrinks faster.`);
    }
    draw();
  };

  /* ---------- 0.4 Annualisation ---------- */
  LABS.annualise = function (root) {
    const sel = $("#an-m", root);
    const v = ranges(root, { "an-r": (x) => `${fmt.num(x, 2)}%` }, draw);
    sel.addEventListener("change", draw);
    function draw() {
      const r = v["an-r"] / 100, m = +sel.value;
      const simple = r * m, ear = F.ear(r, m);
      set(root, "an-s", pct(simple, 2));
      set(root, "an-e", pct(ear, 2));
      set(root, "an-g", `+${fmt.num((ear - simple) * 100, 2)} pts`);
      const label = { 12: "a month", 4: "a quarter", 2: "a half-year", 52: "a week" }[m];
      set(root, "an-insight", `${fmt.num(v["an-r"], 2)}% ${label} is quoted as ${pct(simple, 1)} a year, but a balance left to compound grows by <b>${pct(ear, 1)}</b> a year. The gap widens as the rate rises.`);
    }
    draw();
  };

  /* ---------- 0.5 Historical CPI (Economic Survey 2020-21, Vol 2, Ch 5, Table 1) ---------- */
  const CPI_C_ANNUAL = [ ["2014-15", 0.059], ["2015-16", 0.049], ["2016-17", 0.045], ["2017-18", 0.036], ["2018-19", 0.034], ["2019-20", 0.048] ];
  LABS.cpihist = function (root) {
    const labels = ["Start of 2014-15"], level = [100], power = [100];
    CPI_C_ANNUAL.forEach(([yr, r]) => { labels.push(`End of ${yr}`); level.push(level[level.length - 1] * (1 + r)); power.push(100 / (level[level.length - 1] / 100)); });
    FA.chart(root, {
      title: "Price level and the purchasing power of ₹100, India", desc: "Price level rises from 100 to about 130 while ₹100 of cash falls to about 77 in purchasing power, 2014-15 to 2019-20.",
      series: [
        { name: "Price level (start = 100)", color: "--series-2", values: level, endLabel: `${level[6].toFixed(1)}` },
        { name: "What ₹100 of cash buys", color: "--series-1", values: power, endLabel: `₹${power[6].toFixed(1)}` },
      ],
      x: { values: labels, fmt: (v, i) => (i === 0 ? "Apr 2014" : `Mar ’${14 + i}`) },
      y: { fmt: (v) => v.toFixed(0), min: 60, max: 140 }, tipFmt: (v) => v.toFixed(1), tipTitle: (x) => x, endLabels: true, height: 250,
    });
  };

  /* ---------- 0.5 Real return ---------- */
  LABS.realret = function (root) {
    const chart = FA.chart($("#rr-chart", root), {
      title: "Rupees vs purchasing power", desc: "Nominal value of the investment compared with its value in today’s rupees.",
      series: [], x: { values: [], label: "Years" }, y: { fmt: fmt.inrAxis, min: 0 }, tipFmt: money, tipTitle: (x) => `Year ${x}`, tableFmt: rupee,
      refLine: null,
    });
    const v = ranges(root, { "rr-amt": rupee, "rr-n": (x) => `${fmt.num(x, 2)}%`, "rr-i": (x) => `${fmt.num(x, 2)}%`, "rr-y": years }, draw);
    function draw() {
      const P = v["rr-amt"], rn = v["rr-n"] / 100, pi = v["rr-i"] / 100, n = v["rr-y"];
      const real = F.realReturn(rn, pi), approx = rn - pi;
      const xs = Array.from({ length: n + 1 }, (_, i) => i);
      const nom = xs.map((t) => F.fv(P, rn, t)), rv = xs.map((t) => F.fv(P, rn, t) / Math.pow(1 + pi, t));
      chart.update({
        x: { values: xs, label: "Years" },
        series: [{ name: "Rupees", color: "--series-1", values: nom }, { name: "Purchasing power (today’s rupees)", color: "--series-2", values: rv }],
        refLine: { y: P, label: `Starting amount ${money(P)}` },
      });
      set(root, "rr-real", `${real >= 0 ? "" : ""}${pct(real, 2)}`);
      set(root, "rr-approx", `subtraction says ${pct(approx, 2)} (error ${fmt.num(Math.abs(approx - real) * 100, 2)} pts)`);
      $("#rr-real", root).closest(".readout").classList.toggle("is-neg", real < 0);
      set(root, "rr-nom", money(nom[n]));
      set(root, "rr-rv", money(rv[n]));
      let msg;
      if (real < -0.0001) msg = `Your rupees grow to ${money(nom[n])}, but they buy only what <b>${money(rv[n])}</b> buys today: a real loss of ${pct(1 - rv[n] / P, 0)} over ${n} years, even though the balance never went down.`;
      else if (real < 0.0001) msg = "Nominal return equals inflation: more rupees, exactly the same purchasing power.";
      else msg = `Purchasing power grows ${pct(real, 2)} a year, so ${money(P)} today becomes the equivalent of <b>${money(rv[n])}</b> in today’s money after ${n} years, not the ${money(nom[n])} the statement will show.`;
      set(root, "rr-insight", msg);
    }
    draw();
  };

  /* ---------- 0.6 Goal planner ---------- */
  function goalMonthly(cost, n, g, r, saved, delay) {
    const fvCost = cost * Math.pow(1 + g, n);
    const months = (n - delay) * 12;
    const gap = fvCost - saved * Math.pow(1 + r, n);
    if (months <= 0) return { fvCost, monthly: gap > 0 ? Infinity : 0, months };
    return { fvCost, monthly: gap > 0 ? F.requiredContribution(gap, F.periodic(r, 12), months) : 0, months };
  }
  LABS.goal = function (root) {
    const chart = FA.chart($("#gp-chart", root), {
      type: "bars", title: "Monthly saving needed, by years of delay", desc: "Each column is the monthly amount needed if saving starts that many years from now.",
      series: [], x: { values: [], label: "Years before you start saving" }, y: { fmt: fmt.inrAxis, min: 0 }, tipFmt: rupee, tipTitle: (x) => (x === 0 ? "Start now" : `Start in ${x} year${x === 1 ? "" : "s"}`), height: 240,
    });
    const v = ranges(root, { "gp-c": money, "gp-n": years, "gp-g": pctIn, "gp-r": pctIn, "gp-s": money }, draw);
    function draw() {
      const cost = v["gp-c"], n = v["gp-n"], g = v["gp-g"] / 100, r = v["gp-r"] / 100, saved = v["gp-s"];
      const now = goalMonthly(cost, n, g, r, saved, 0);
      const maxDelay = Math.min(n - 1, 10);
      const delays = Array.from({ length: maxDelay + 1 }, (_, d) => d);
      const vals = delays.map((d) => goalMonthly(cost, n, g, r, saved, d).monthly);
      chart.update({ x: { values: delays, label: "Years before you start saving", fmt: (d) => (d === 0 ? "Now" : `+${d}`) }, series: [{ name: "Monthly saving needed", color: "--series-1", values: vals }] });
      set(root, "gp-fv", money(now.fvCost));
      set(root, "gp-m", now.monthly === 0 ? "₹0" : rupee(now.monthly));
      set(root, "gp-m-sub", now.monthly > 0 ? `${money(now.monthly * now.months)} contributed in total` : "existing savings are enough");
      if (n > 5) {
        const late = goalMonthly(cost, n, g, r, saved, 5);
        set(root, "gp-d", late.monthly === 0 ? "₹0" : rupee(late.monthly));
        set(root, "gp-d-sub", now.monthly > 0 ? `${fmt.num(late.monthly / now.monthly, 1)}× the amount` : "");
      } else { set(root, "gp-d", "n/a"); set(root, "gp-d-sub", "goal is 5 years away or less"); }
      set(root, "gp-r-hint", n <= 3 && r > 0.075 ? "For a goal this close, a high assumed return is hard to justify: there is no time to recover from a fall." : "An assumption, not a promise. Keep it realistic for the horizon.");
      const realR = (1 + r) / (1 + g) - 1;
      let msg;
      if (now.monthly === 0) msg = "Your existing savings, growing at the assumed return, already cover the future cost.";
      else if (maxDelay >= 1) msg = `The goal costs <b>${money(now.fvCost)}</b> in the year you need it. Each year of delay raises the monthly amount; waiting ${maxDelay} years means <b>${rupee(vals[maxDelay])}</b> a month instead of ${rupee(vals[0])}. Your assumed real return is ${pct(realR, 1)} a year.`;
      else msg = `With one year to go, the return hardly matters: you need to save about ${rupee(now.monthly)} a month.`;
      set(root, "gp-insight", msg);
    }
    draw();
  };

  /* ---------- 0.7 Emergency fund ---------- */
  LABS.emergency = function (root) {
    const chart = FA.chart($("#ef-chart", root), {
      title: "Buffer during the shock", desc: "Remaining buffer at the end of each month without salary; below zero means borrowing.",
      series: [], x: { values: [], label: "Months into the shock" }, y: { fmt: fmt.inrAxis }, tipFmt: money, tipTitle: (x) => (x === 0 ? "Start" : `End of month ${x}`), height: 230,
      refLine: { y: 0, label: "Buffer exhausted" },
    });
    const st = $("#ef-st", root), hc = $("#ef-hc", root), oi = $("#ef-oi", root);
    const v = ranges(root, { "ef-e": rupee, "ef-dep": (x) => String(x), "ef-b": rupee, "ef-sm": (x) => `${x} mo`, "ef-si": rupee }, draw);
    [st, hc, oi].forEach((el) => el.addEventListener("change", draw));
    function draw() {
      const E = v["ef-e"], B = v["ef-b"], sm = v["ef-sm"], inc = v["ef-si"];
      const t = F.emergencyTarget({ essentials: E, stability: st.value, dependants: v["ef-dep"], healthCover: hc.checked, otherIncome: oi.checked });
      const burn = E - inc;
      const xs = Array.from({ length: sm + 1 }, (_, i) => i);
      const bal = xs.map((m) => B - burn * m);
      chart.update({ x: { values: xs, label: "Months into the shock" }, series: [{ name: "Buffer remaining", color: bal[sm] < 0 ? "--series-2" : "--series-1", kind: "area", values: bal }], y: { fmt: fmt.inrAxis, min: Math.min(0, ...bal), max: Math.max(B, 1) } });
      set(root, "ef-t", money(t.mid));
      set(root, "ef-t-sub", `about ${fmt.num(t.months, 1)} months · range ${money(t.low)} to ${money(t.high)}`);
      const rw = F.runway(B, E, inc);
      set(root, "ef-r", isFinite(rw) ? `${fmt.num(rw, 1)} months` : "unlimited");
      set(root, "ef-r-sub", isFinite(rw) ? `at ${money(burn)} a month net outflow` : "other income covers essentials");
      const short = Math.max(0, -bal[sm]);
      set(root, "ef-sf", short > 0 ? money(short) : "none");
      set(root, "ef-sf-sub", short > 0 ? "would have to be borrowed or raised by selling" : `${money(bal[sm])} left at the end`);
      const ro = $("#ef-sf", root).closest(".readout"); ro.classList.toggle("is-neg", short > 0); ro.classList.toggle("is-pos", short === 0);
      let msg;
      if (!isFinite(rw)) msg = "Income during the shock covers essential spending, so the buffer is never touched. Most single-earner households cannot rely on this.";
      else if (short > 0) {
        const cardInt = short * 0.035;
        msg = `The buffer runs out in <b>month ${Math.floor(rw) + 1}</b>. The remaining ${money(short)} would go on a card or a quick loan: at 3.5% a month that is about <b>${rupee(cardInt)}</b> of interest for every month it stays unpaid. To survive this shock you need ${money(burn * sm)}.`;
      } else if (B < t.low) msg = `This shock is covered, but your buffer is below the suggested range for your situation. A longer or deeper shock would not be.`;
      else msg = `Covered, with ${money(bal[sm])} to spare. Your buffer sits ${B > t.high ? "above" : "within"} the suggested range${B > t.high ? `: the excess (about ${money(B - t.high)}) could be invested for goals instead` : ""}.`;
      set(root, "ef-insight", msg);
    }
    draw();
  };

  /* ---------- 0.8 Loan lab ---------- */
  LABS.loan = function (root) {
    const chart = FA.chart($("#ln-chart", root), {
      type: "bars", title: "Where each year’s payments go", desc: "Stacked columns of interest and principal repaid each year, including any prepayment.",
      series: [], x: { values: [], label: "Year of the loan" }, y: { fmt: fmt.inrAxis, min: 0 }, tipFmt: money, tipTitle: (x) => `Year ${x}`, tableFmt: rupee,
    });
    let mode = "tenure";
    seg(root, "mode", (m) => { mode = m; draw(); });
    const pm = $("#ln-pm", root);
    const v = ranges(root, { "ln-p": money, "ln-r": (x) => `${fmt.num(x, 2)}%`, "ln-n": years, "ln-pp": money, "ln-pm": (x) => `Year ${x}` }, draw);
    function draw() {
      const P = v["ln-p"], r = v["ln-r"] / 100, n = v["ln-n"] * 12;
      pm.max = String(Math.max(1, v["ln-n"] - 1));
      if (+pm.value > +pm.max) { pm.value = pm.max; v["ln-pm"] = +pm.max; $("#ln-pm-o", root).textContent = `Year ${pm.max}`; }
      const pp = Math.min(v["ln-pp"], P * 0.95), month = v["ln-pm"] * 12;
      const base = F.schedule(P, r, n);
      const alt = pp > 0 && v["ln-n"] > 1 ? F.schedule(P, r, n, { month, amount: pp, mode }) : base;
      const yrs = F.byYear(alt.rows);
      chart.update({
        x: { values: yrs.map((y) => y.year), label: "Year of the loan", fmt: (x) => String(x) },
        series: [
          { name: "Interest", color: "--series-2", stack: true, values: yrs.map((y) => y.interest) },
          { name: "Principal repaid", color: "--series-1", stack: true, values: yrs.map((y) => y.principal) },
        ],
      });
      set(root, "ln-emi", rupee(base.firstEmi));
      set(root, "ln-emi-sub", mode === "emi" && alt !== base ? `falls to ${rupee(alt.rows[alt.rows.length - 1].emi)} after the prepayment` : `month 1: ${pct(base.rows[0].interest / base.firstEmi, 0)} of it is interest`);
      set(root, "ln-ti", money(base.totalInterest));
      set(root, "ln-ti-sub", `${pct(base.totalInterest / P, 0)} of the amount borrowed`);
      const saved = base.totalInterest - alt.totalInterest;
      set(root, "ln-sv", alt === base ? "n/a" : money(saved));
      set(root, "ln-sv-sub", alt === base ? "set a prepayment" : mode === "tenure" ? `loan ends ${fmt.months(base.months - alt.months)} early` : "same end date, lower EMI");
      const y1 = F.byYear(base.rows)[0];
      let msg = `In year 1 you pay <b>${money(y1.interest)}</b> of interest and repay only ${money(y1.principal)} of the loan.`;
      if (alt !== base) {
        const other = F.schedule(P, r, n, { month, amount: pp, mode: mode === "tenure" ? "emi" : "tenure" });
        const otherSaved = base.totalInterest - other.totalInterest;
        msg += mode === "tenure"
          ? ` Using the ${money(pp)} prepayment to shorten the loan saves <b>${money(saved)}</b>; lowering the EMI instead would save ${money(otherSaved)}.`
          : ` Lowering the EMI saves ${money(saved)} of interest; shortening the loan instead would save <b>${money(otherSaved)}</b>, at the cost of no monthly relief.`;
      }
      set(root, "ln-insight", msg);
    }
    draw();
  };

  /* ---------- 0.8 Minimum due ---------- */
  LABS.mindue = function (root) {
    const chart = FA.chart($("#md-chart", root), {
      title: "Card balance over time", desc: "Outstanding balance month by month under the chosen payment rule.",
      series: [], x: { values: [], label: "Years" }, y: { fmt: fmt.inrAxis, min: 0 }, tipFmt: money, height: 230, tableEvery: 12,
    });
    const v = ranges(root, { "md-b": rupee, "md-r": (x) => `${fmt.num(x, 2)}%`, "md-m": (x) => `${fmt.num(x, 1)}%`, "md-f": (x) => (x ? rupee(x) : "off") }, draw);
    function draw() {
      const b = v["md-b"], r = v["md-r"] / 100, fixed = v["md-f"];
      const res = F.minimumDue({ balance: b, monthlyRate: r, minPct: v["md-m"] / 100, floor: 500, fixedPayment: fixed });
      const minRes = F.minimumDue({ balance: b, monthlyRate: r, minPct: v["md-m"] / 100, floor: 500 });
      const path = res.path.slice(0, 721);
      const xs = path.map((_, i) => i);
      chart.update({
        x: { values: xs, label: "Years", fmt: (m) => fmt.num(m / 12, m % 12 ? 1 : 0), every: Math.max(12, Math.ceil(xs.length / 8 / 12) * 12) },
        tipTitle: (m) => `Month ${m}`,
        series: [{ name: "Balance", color: "--series-2", kind: "area", values: path }],
      });
      set(root, "md-t", isFinite(res.months) ? fmt.months(res.months) : "never");
      set(root, "md-i", isFinite(res.months) ? money(res.interest) : "unbounded");
      set(root, "md-i-sub", isFinite(res.months) ? `${pct(res.interest / b, 0)} of the original balance` : "the payment does not cover the interest");
      set(root, "md-e", pct(F.ear(r, 12), 1));
      let msg;
      if (!isFinite(res.months)) msg = `A fixed payment of ${rupee(fixed)} is less than the first month’s interest (${rupee(b * r)}), so the balance never falls. This is negative amortisation, which the RBI rules forbid for the minimum due.`;
      else if (fixed > 0) msg = `Paying a fixed ${rupee(fixed)} clears the balance in <b>${fmt.months(res.months)}</b> with ${money(res.interest)} of interest, against ${fmt.months(minRes.months)} and ${money(minRes.interest)} paying only the minimum.`;
      else msg = `Paying only the minimum, the balance takes <b>${fmt.months(res.months)}</b> to clear and costs <b>${money(res.interest)}</b> in interest. The minimum shrinks as the balance shrinks, so progress slows to a crawl. Try a fixed payment instead.`;
      set(root, "md-insight", msg);
    }
    draw();
  };

  /* ---------- 0.9 Risk pooling ---------- */
  LABS.pool = function (root) {
    const chart = FA.chart($("#pl-chart", root), {
      type: "bars", title: "What 1,000 uninsured households paid in total", desc: "Histogram: number of households by total loss over the period, if uninsured.",
      series: [], x: { values: [], label: "Total loss over the period, uninsured" }, y: { fmt: (v) => fmt.num(v), min: 0 }, tipFmt: (v) => `${fmt.num(v)} households`, height: 240, barLabels: true, barLabelFmt: (v) => fmt.num(v),
    });
    let seed = 7;
    $("#pl-run", root).addEventListener("click", () => { seed = (seed * 48271) % 2147483647; draw(); });
    const v = ranges(root, { "pl-p": (x) => `${fmt.num(x, 1)}%`, "pl-l": money, "pl-y": years, "pl-ld": pctIn }, draw);
    function draw() {
      const p = v["pl-p"] / 100, L = v["pl-l"], yrs = v["pl-y"];
      const s = F.poolSim({ households: 1000, p, loss: L, loading: v["pl-ld"] / 100, years: yrs, seed });
      const maxK = Math.max(...s.alone.map((c) => Math.round(c / L)));
      const counts = Array.from({ length: maxK + 1 }, (_, k) => s.alone.filter((c) => Math.round(c / L) === k).length);
      chart.update({ x: { values: counts.map((_, k) => k * L), label: "Total loss over the period, uninsured", fmt: (x) => (x === 0 ? "No loss" : fmt.inrAxis(x)) },
        tipTitle: (x) => (x === 0 ? "No loss at all" : `Lost ${money(x)}`),
        series: [{ name: "Households", color: "--series-2", values: counts }] });
      set(root, "pl-ins", money(s.insured));
      set(root, "pl-ins-sub", `${rupee(s.premium)} a year, no surprises`);
      set(root, "pl-avg", money(s.mean));
      set(root, "pl-avg-sub", `expected ${money(s.expected)}`);
      set(root, "pl-worst", money(s.worst));
      set(root, "pl-worst-sub", `${fmt.num(s.hit)} of 1,000 hit at least once`);
      set(root, "pl-insight", `Uninsured, <b>${fmt.num(1000 - s.hit)}</b> households pay nothing and <b>${fmt.num(s.hit)}</b> pay ${money(L)} or more, up to ${money(s.worst)}. Insured, every household pays ${money(s.insured)}: more than the ${money(s.mean)} average, but nobody faces the ruinous right-hand tail. That trade is what the premium buys.`);
    }
    draw();
  };

  /* ---------- 0.9 Cover estimator ---------- */
  LABS.cover = function (root) {
    const chart = FA.chart($("#cv-chart", root), {
      type: "bars", title: "Building up the cover estimate", desc: "Components of the needs-based cover: living costs, debts and goals, minus existing assets.",
      series: [], x: { values: ["Living costs", "Debts", "Goals", "Less: assets", "Cover needed"] }, y: { fmt: fmt.inrAxis, min: 0 }, tipFmt: money, height: 220,
    });
    const v = ranges(root, { "cv-e": money, "cv-y": years, "cv-r": pctIn, "cv-d": money, "cv-g": money, "cv-a": money }, draw);
    function draw() {
      const args = { annualExpenses: v["cv-e"], years: v["cv-y"], realRate: v["cv-r"] / 100, debts: v["cv-d"], goals: v["cv-g"], assets: v["cv-a"], existingCover: 0 };
      const c = F.lifeCoverNeed(args);
      const lower = F.lifeCoverNeed(Object.assign({}, args, { realRate: Math.max(0, args.realRate - 0.01) }));
      chart.update({ series: [{ name: "Amount", color: "--series-1", values: [c.pvExp, args.debts, args.goals, args.assets, c.need] }] });
      set(root, "cv-need", money(c.need));
      set(root, "cv-pv", money(c.pvExp));
      set(root, "cv-sens", `+${money(lower.need - c.need)}`);
      const share = c.gross > 0 ? c.pvExp / c.gross : 0;
      set(root, "cv-insight", `Future living costs make up <b>${pct(share, 0)}</b> of the total need, so the years of support and the real return drive the answer most. A 1-point lower real return adds ${money(lower.need - c.need)}.`);
    }
    draw();
  };

  /* ---------- 0.10 Tax slabs ---------- */
  LABS.tax = function (root) {
    const CLIP = 0.4;
    const chart = FA.chart($("#tx-chart", root), {
      title: "Average and marginal tax rate by gross salary", desc: "Marginal rate steps up by slab; the average rate rises smoothly below it. The marginal-relief spike is clipped at 40%.",
      series: [], x: { values: [], label: "Gross salary per year" }, y: { fmt: (v) => `${Math.round(v * 100)}%`, min: 0, max: CLIP }, tipFmt: (v) => pct(v, 1), height: 250, tableEvery: 8,
    });
    const sal = $("#tx-sal", root);
    sal.addEventListener("change", draw);
    const v = ranges(root, { "tx-g": money }, draw);
    const xs = []; for (let g = 300000; g <= 5000000; g += 25000) xs.push(g);
    function draw() {
      const opts = { salaried: sal.checked };
      const g = v["tx-g"];
      const t = F.incomeTax(g, opts), m = F.marginalRate(g, opts);
      const avg = xs.map((x) => F.incomeTax(x, opts).average), mar = xs.map((x) => F.marginalRate(x, opts));
      const i = xs.indexOf(g);
      chart.update({
        x: { values: xs, label: "Gross salary per year", fmt: fmt.inrAxis },
        tipTitle: (x) => `Gross ${money(x)}`,
        series: [
          { name: "Marginal rate (clipped at 40%)", color: "--series-1", values: mar.map((r) => Math.min(r, CLIP)) },
          { name: "Average rate", color: "--series-2", values: avg },
        ],
        annotations: i >= 0 ? [{ i, text: `You: ${money(g)}` }] : [],
        tipExtra: (k) => (mar[k] > CLIP ? `<div class="row"><span>Actual marginal</span><span>${pct(mar[k], 0)}</span></div>` : ""),
      });
      $("#tx-rows", root).innerHTML = t.parts.map((p) => `<tr><td>${p.to === Infinity ? `Above ${fmt.inrShort(p.from)}` : `${fmt.inrShort(p.from)} to ${fmt.inrShort(p.to)}`}</td><td class="r">${Math.round(p.rate * 100)}%</td><td class="r">${rupee(p.tax)}</td></tr>`).join("") +
        `<tr class="total"><td colspan="2">${t.afterRebate < t.before ? (t.afterRebate === 0 ? "Rebate: tax reduced to nil" : "Marginal relief applied") : "No rebate (income above ₹12 lakh)"}</td><td class="r">${rupee(t.afterRebate)}</td></tr>`;
      set(root, "tx-t", rupee(t.total));
      set(root, "tx-t-sub", `taxable income ${money(t.taxable)}`);
      set(root, "tx-a", pct(t.average, 1));
      set(root, "tx-m", pct(m, 1));
      let msg;
      if (t.total === 0 && m === 0) msg = `At ${money(g)} the rebate reduces tax to nil, and a little more income would still be tax-free.`;
      else if (m > 0.5) msg = `You are in the <b>marginal-relief band</b>: each extra rupee is taxed at about ${pct(m, 0)} until income reaches about ₹13.46 lakh gross. Take-home still rises, very slowly.`;
      else msg = `On your next ₹10,000 of salary you would pay about <b>${rupee(m * 10000)}</b> in tax (marginal ${pct(m, 1)}), even though your average rate is only ${pct(t.average, 1)}. Decisions about extra income use the marginal rate.`;
      set(root, "tx-insight", msg);
    }
    draw();
  };

  /* ---------- 0.11 Ponzi ---------- */
  LABS.ponzi = function (root) {
    const chart = FA.chart($("#pz-chart", root), {
      title: "What the scheme owes vs the cash it holds", desc: "Money owed to investors compared with actual cash, month by month, until cash runs out.",
      series: [], x: { values: [], label: "Months" }, y: { fmt: fmt.inrAxis }, tipFmt: money, tipTitle: (x) => `Month ${x}`, height: 250, tableEvery: 3,
      refLine: { y: 0, label: "Cash runs out" },
    });
    const v = ranges(root, { "pz-r": (x) => `${fmt.num(x, 2)}%`, "pz-g": (x) => `${fmt.num(x, 1)}%`, "pz-s": (x) => `${x} mo`, "pz-w": (x) => `${fmt.num(x, 2)}%`, "pz-k": pctIn }, draw);
    function draw() {
      const res = F.ponzi({ promised: v["pz-r"] / 100, growth: v["pz-g"] / 100, saturation: v["pz-s"], withdrawRate: v["pz-w"] / 100, skim: v["pz-k"] / 100, months: 120 });
      const p = res.path;
      chart.update({
        x: { values: p.map((r) => r.month), label: "Months" },
        series: [
          { name: "Owed to investors", color: "--series-2", values: p.map((r) => r.owed) },
          { name: "Cash actually held", color: "--series-1", kind: "area", values: p.map((r) => r.cash) },
        ],
        y: { fmt: fmt.inrAxis, min: Math.min(0, ...p.map((r) => r.cash)) },
      });
      const last = p[p.length - 1];
      set(root, "pz-c", res.collapse ? `month ${res.collapse}` : "not within 10 years");
      set(root, "pz-c-sub", res.collapse ? `about ${fmt.num(res.collapse / 12, 1)} years` : "recruitment still outpaces promises");
      set(root, "pz-n", fmt.num(last.investors));
      set(root, "pz-o", `${money(last.owed)}`);
      set(root, "pz-o-sub", `vs ${money(Math.max(0, last.cash))} of cash`);
      $("#pz-c", root).closest(".readout").classList.toggle("is-neg", !!res.collapse);
      const annual = F.ear(v["pz-r"] / 100, 12);
      set(root, "pz-insight", res.collapse
        ? `Promising ${fmt.num(v["pz-r"], 2)}% a month (${pct(annual, 0)} a year) with no real earnings, the scheme runs out of cash in <b>month ${res.collapse}</b>, owing <b>${money(last.owed)}</b> to ${fmt.num(last.investors)} investors. Everything they were shown as “returns” was other investors' money.`
        : `With recruitment this strong the scheme survives the 10-year window, and is simply larger when it fails: it owes ${money(last.owed)} to ${fmt.num(last.investors)} investors. No population can keep growing at ${fmt.num(v["pz-g"], 1)}% a month forever.`);
    }
    draw();
  };

  /* ---------- registry & lazy init ---------- */
  FA.labs = LABS;
  function initIn(el) {
    $$("[data-lab]", el).forEach((node) => {
      if (node.dataset.labReady) return;
      const fn = LABS[node.dataset.lab];
      if (!fn) { console.warn("No lab:", node.dataset.lab); return; }
      node.dataset.labReady = "1";
      try { fn(node); } catch (e) { console.error("Lab failed:", node.dataset.lab, e); node.insertAdjacentHTML("beforeend", `<p class="source-note">This explorer could not start in your browser. The lesson text and worked examples above cover the same ideas.</p>`); }
    });
  }
  document.addEventListener("fa:lesson", (e) => initIn(e.detail.el));
})();
