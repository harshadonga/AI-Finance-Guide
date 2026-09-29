/* =====================================================================
   Project 0: Personal Financial Dashboard
   Data stays in this browser (localStorage, wrapped for failure) and can
   be exported to / imported from a JSON file. Computations reuse FIN.
   ===================================================================== */
(function () {
  "use strict";
  const { fmt, $, $$ } = FA;
  const F = window.FIN;
  const KEY = "m00:project0";
  const VERSION = 1;

  const SAMPLE = {
    version: VERSION, sample: true,
    income: { takeHome: 110000, other: 0 },
    expenses: { fixed: 37500, variable: 17500, discretionary: 23000 },
    assets: [
      { name: "Savings account", value: 180000, band: "instant", type: "cash" },
      { name: "Fixed deposit", value: 100000, band: "days", type: "cash" },
      { name: "Equity mutual funds", value: 240000, band: "days", type: "growth" },
      { name: "Gold jewellery (buy-back value)", value: 150000, band: "months", type: "other" },
      { name: "Rent security deposit", value: 84000, band: "months", type: "other" },
      { name: "Scooter and laptop (resale)", value: 80000, band: "months", type: "use" },
      { name: "EPF balance", value: 310000, band: "locked", type: "retirement" },
    ],
    liabilities: [
      { name: "Credit card", balance: 85000, rate: 42, emi: 0, short: true },
      { name: "Education loan", balance: 320000, rate: 10.5, emi: 6800, short: false },
    ],
    emergency: { months: 6 },
    insurance: { dependants: 0, familyExpenses: 0, supportYears: 0, lifeCover: 0, healthCover: 500000, employerHealth: 300000 },
    goals: [
      { name: "Car", cost: 800000, years: 2, inflation: 5, ret: 6.5, saved: 0, monthly: 10000 },
      { name: "Flat down payment", cost: 1800000, years: 5, inflation: 6, ret: 7, saved: 0, monthly: 10000 },
      { name: "Retirement top-up", cost: 14000000, years: 31, inflation: 5, ret: 10, saved: 550000, monthly: 12000 },
    ],
    notes: { diagnosis: "", actions: "" },
  };
  const EMPTY = {
    version: VERSION, sample: false,
    income: { takeHome: 0, other: 0 }, expenses: { fixed: 0, variable: 0, discretionary: 0 },
    assets: [{ name: "Savings account", value: 0, band: "instant", type: "cash" }],
    liabilities: [], emergency: { months: 6 },
    insurance: { dependants: 0, familyExpenses: 0, supportYears: 0, lifeCover: 0, healthCover: 0, employerHealth: 0 },
    goals: [], notes: { diagnosis: "", actions: "" },
  };
  const BANDS = [["instant", "Instant"], ["days", "Within days"], ["months", "Weeks to months"], ["locked", "Locked for years"]];
  const TYPES = [["cash", "Cash or deposit"], ["growth", "Market investment"], ["retirement", "Retirement"], ["property", "Property"], ["use", "Vehicle or gadget"], ["other", "Other"]];
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const num = (s) => { const v = parseFloat(String(s ?? "").replace(/[,₹\s%]/g, "")); return isFinite(v) ? v : 0; };
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function validate(d) {
    if (!d || typeof d !== "object" || !d.income || !d.expenses || !Array.isArray(d.assets)) throw new Error("This file does not look like a Project 0 export.");
    const base = clone(EMPTY);
    return Object.assign(base, d, {
      income: Object.assign(base.income, d.income), expenses: Object.assign(base.expenses, d.expenses),
      emergency: Object.assign(base.emergency, d.emergency), insurance: Object.assign(base.insurance, d.insurance),
      notes: Object.assign(base.notes, d.notes), liabilities: Array.isArray(d.liabilities) ? d.liabilities : [], goals: Array.isArray(d.goals) ? d.goals : [],
    });
  }

  function compute(d) {
    const income = num(d.income.takeHome) + num(d.income.other);
    const ess = num(d.expenses.fixed) + num(d.expenses.variable);
    const spend = ess + num(d.expenses.discretionary);
    const A = d.assets.reduce((s, a) => s + num(a.value), 0);
    const L = d.liabilities.reduce((s, l) => s + num(l.balance), 0);
    const NW = A - L;
    const liquid = d.assets.filter((a) => a.band === "instant" || a.band === "days").reduce((s, a) => s + num(a.value), 0);
    const stable = d.assets.filter((a) => (a.band === "instant" || a.band === "days") && a.type === "cash").reduce((s, a) => s + num(a.value), 0);
    const shortL = d.liabilities.filter((l) => l.short).reduce((s, l) => s + num(l.balance), 0);
    const emi = d.liabilities.reduce((s, l) => s + num(l.emi), 0);
    const target = num(d.emergency.months) * ess;
    const buffer = Math.max(0, stable - shortL);
    const runway = ess > 0 ? buffer / ess : Infinity;
    const expensive = d.liabilities.filter((l) => num(l.rate) >= 15 && num(l.balance) > 0);
    const deps = num(d.insurance.dependants);
    const fin = d.assets.filter((a) => ["cash", "growth"].includes(a.type)).reduce((s, a) => s + num(a.value), 0);
    const goalsToday = d.goals.reduce((s, g) => s + num(g.cost), 0);
    let lifeNeed = 0, lifeGap = 0;
    if (deps > 0) {
      lifeNeed = F.lifeCoverNeed({ annualExpenses: num(d.insurance.familyExpenses), years: num(d.insurance.supportYears), realRate: 0.02, debts: L, goals: goalsToday * 0.5, assets: fin, existingCover: 0 }).need;
      lifeGap = Math.max(0, lifeNeed - num(d.insurance.lifeCover));
    }
    const goals = d.goals.map((g) => {
      const n = num(g.years), r = num(g.ret) / 100;
      const fv = num(g.cost) * Math.pow(1 + num(g.inflation) / 100, n);
      const gap = fv - num(g.saved) * Math.pow(1 + r, n);
      const need = n > 0 && gap > 0 ? F.requiredContribution(gap, F.periodic(r, 12), n * 12) : 0;
      return { name: g.name, fv, need, have: num(g.monthly), ok: num(g.monthly) >= need * 0.98 };
    });
    const alloc = TYPES.map(([t, label]) => ({ label, value: d.assets.filter((a) => a.type === t).reduce((s, a) => s + num(a.value), 0) })).filter((x) => x.value > 0);
    return { income, ess, spend, save: income - spend, rate: income > 0 ? (income - spend) / income : 0, fcf: income - ess, A, L, NW, liquid, lnw: liquid - shortL, stable, lev: NW > 0 ? A / NW : Infinity, emi, emiRatio: income > 0 ? emi / income : 0, target, buffer, runway, expensive, deps, lifeNeed, lifeGap, goals, alloc, health: num(d.insurance.healthCover), healthEmp: num(d.insurance.employerHealth) };
  }

  function chip(state, text) {
    const icon = state === "good" ? "check-circle" : state === "warn" ? "warning" : "warning-octagon";
    const label = state === "good" ? "On track" : state === "warn" ? "Watch" : "Act first";
    return `<span class="chip chip--${state}">${FA.icon(icon)}<span>${label}</span></span>${text ? `<span class="chip-note">${text}</span>` : ""}`;
  }

  LABS_P0();
  function LABS_P0() {
    FA.labs.project0 = function (root) {
      let data, saveTimer;
      const saved = FA.store.get(KEY, null);
      try { data = saved ? validate(saved) : clone(SAMPLE); } catch (e) { data = clone(SAMPLE); }

      const form = $("#p0-form", root);
      function persist() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
          const ok = FA.store.set(KEY, data);
          setMode(ok ? null : "This browser is not keeping data (private window or blocked storage). Export a file to keep your numbers.");
        }, 300);
      }
      function setMode(extra) {
        $("#p0-mode", root).innerHTML = (data.sample ? `${FA.icon("flask")} Showing <strong>Meera’s sample numbers</strong> (hypothetical). Choose "Start with my numbers" to enter your own.` : `${FA.icon("lock-simple")} Your numbers, saved only in this browser.`) + (extra ? ` <span class="p0-warn">${extra}</span>` : "");
      }
      const getK = (k) => k.split(".").reduce((o, p) => (o ? o[p] : undefined), data);
      const setK = (k, v) => { const ps = k.split("."); const last = ps.pop(); ps.reduce((o, p) => o[p], data)[last] = v; };

      function fillScalars() {
        $$("[data-k]", form).forEach((el) => {
          const v = getK(el.dataset.k);
          el.value = el.tagName === "TEXTAREA" ? (v || "") : (v ? fmt.num(v, v % 1 ? 2 : 0) : "");
          el.placeholder = el.tagName === "TEXTAREA" ? "" : "0";
        });
      }
      function rowsHTML() {
        $("#p0-assets", root).innerHTML = data.assets.map((a, i) => `
          <div class="p0-row" data-list="assets" data-i="${i}">
            <div class="field p0-name"><label for="as-n-${i}">Asset</label><input class="input" id="as-n-${i}" name="asset-name-${i}" autocomplete="off" data-f="name" value="${esc(a.name)}"></div>
            <div class="field"><label for="as-v-${i}">Value today (₹)</label><input class="input" id="as-v-${i}" data-f="value" inputmode="numeric" autocomplete="off" value="${a.value ? fmt.num(a.value) : ""}" placeholder="0"></div>
            <div class="field"><label for="as-b-${i}">Liquidity</label><select class="input" id="as-b-${i}" data-f="band">${BANDS.map(([v, l]) => `<option value="${v}"${a.band === v ? " selected" : ""}>${l}</option>`).join("")}</select></div>
            <div class="field"><label for="as-t-${i}">Type</label><select class="input" id="as-t-${i}" data-f="type">${TYPES.map(([v, l]) => `<option value="${v}"${a.type === v ? " selected" : ""}>${l}</option>`).join("")}</select></div>
            <button type="button" class="btn btn--ghost btn--icon p0-del" data-del aria-label="Remove ${esc(a.name || "asset")}">${FA.icon("trash")}</button>
          </div>`).join("") || `<p class="hint">No assets yet. Add your bank balance first.</p>`;
        $("#p0-liabs", root).innerHTML = data.liabilities.map((l, i) => `
          <div class="p0-row" data-list="liabilities" data-i="${i}">
            <div class="field p0-name"><label for="lb-n-${i}">Debt</label><input class="input" id="lb-n-${i}" name="debt-name-${i}" autocomplete="off" data-f="name" value="${esc(l.name)}"></div>
            <div class="field"><label for="lb-b-${i}">Balance (₹)</label><input class="input" id="lb-b-${i}" data-f="balance" inputmode="numeric" value="${l.balance ? fmt.num(l.balance) : ""}" placeholder="0"></div>
            <div class="field"><label for="lb-r-${i}">Rate (% a year)</label><input class="input" id="lb-r-${i}" data-f="rate" inputmode="decimal" value="${l.rate || ""}" placeholder="0"></div>
            <div class="field"><label for="lb-e-${i}">EMI (₹ a month)</label><input class="input" id="lb-e-${i}" data-f="emi" inputmode="numeric" value="${l.emi ? fmt.num(l.emi) : ""}" placeholder="0"></div>
            <label class="check p0-short"><input type="checkbox" data-f="short"${l.short ? " checked" : ""}> Due within a year</label>
            <button type="button" class="btn btn--ghost btn--icon p0-del" data-del aria-label="Remove ${esc(l.name || "debt")}">${FA.icon("trash")}</button>
          </div>`).join("") || `<p class="hint">No debts. If you have a card balance you do not clear in full, add it here.</p>`;
        $("#p0-goals", root).innerHTML = data.goals.map((g, i) => `
          <div class="p0-row p0-row--goal" data-list="goals" data-i="${i}">
            <div class="field p0-name"><label for="gl-n-${i}">Goal</label><input class="input" id="gl-n-${i}" name="goal-name-${i}" autocomplete="off" data-f="name" value="${esc(g.name)}"></div>
            <div class="field"><label for="gl-c-${i}">Cost today (₹)</label><input class="input" id="gl-c-${i}" data-f="cost" inputmode="numeric" value="${g.cost ? fmt.num(g.cost) : ""}" placeholder="0"></div>
            <div class="field"><label for="gl-y-${i}">Years away</label><input class="input" id="gl-y-${i}" data-f="years" inputmode="numeric" value="${g.years || ""}" placeholder="0"></div>
            <div class="field"><label for="gl-i-${i}">Goal inflation (%)</label><input class="input" id="gl-i-${i}" data-f="inflation" inputmode="decimal" value="${g.inflation ?? ""}" placeholder="5"></div>
            <div class="field"><label for="gl-r-${i}">Assumed return (%)</label><input class="input" id="gl-r-${i}" data-f="ret" inputmode="decimal" value="${g.ret ?? ""}" placeholder="7"></div>
            <div class="field"><label for="gl-s-${i}">Already saved (₹)</label><input class="input" id="gl-s-${i}" data-f="saved" inputmode="numeric" value="${g.saved ? fmt.num(g.saved) : ""}" placeholder="0"></div>
            <div class="field"><label for="gl-m-${i}">Saving now (₹ a month)</label><input class="input" id="gl-m-${i}" data-f="monthly" inputmode="numeric" value="${g.monthly ? fmt.num(g.monthly) : ""}" placeholder="0"></div>
            <button type="button" class="btn btn--ghost btn--icon p0-del" data-del aria-label="Remove ${esc(g.name || "goal")}">${FA.icon("trash")}</button>
          </div>`).join("") || `<p class="hint">No goals yet. Add one with its cost in today’s money.</p>`;
      }

      function summary() {
        const c = compute(data);
        const m = fmt.inrShort;
        const cards = [];
        // savings rate
        cards.push({ t: "Savings rate", v: fmt.pct(c.rate, 1), s: c.rate >= 0.2 ? "good" : c.rate >= 0.1 ? "warn" : "act", n: `${m(c.save)} a month of ${m(c.income)} income`, l: "l02-rate" });
        cards.push({ t: "Free cash flow", v: m(c.fcf), s: c.fcf > 0 ? (c.fcf / Math.max(1, c.income) > 0.3 ? "good" : "warn") : "act", n: "after essential costs, per month", l: "l02-fcf" });
        cards.push({ t: "Net worth", v: m(c.NW), s: c.NW >= 0 ? "good" : "warn", n: `${m(c.A)} assets, ${m(c.L)} debts`, l: "l03-nw" });
        cards.push({ t: "Liquid net worth", v: m(c.lnw), s: c.lnw > c.ess * 3 ? "good" : c.lnw > 0 ? "warn" : "act", n: "reachable within days, minus short-term debt", l: "l03-liquid" });
        cards.push({ t: "Leverage and EMIs", v: isFinite(c.lev) ? `${fmt.num(c.lev, 2)}×` : "n/a", s: c.emiRatio > 0.4 || !isFinite(c.lev) ? "act" : c.emiRatio > 0.3 || c.lev > 3 ? "warn" : "good", n: `EMIs are ${fmt.pct(c.emiRatio, 0)} of income`, l: "l03-leverage" });
        cards.push({ t: "Emergency runway", v: isFinite(c.runway) ? `${fmt.num(c.runway, 1)} months` : "n/a", s: c.buffer >= c.target ? "good" : c.buffer >= c.target * 0.5 ? "warn" : "act", n: `target ${m(c.target)} (${fmt.num(num(data.emergency.months), 1)} months); stable buffer ${m(c.buffer)}`, l: "l07-size" });
        const lifeText = c.deps > 0 ? (c.lifeGap > 0 ? `estimated need ${m(c.lifeNeed)}; gap ${m(c.lifeGap)}` : `estimated need ${m(c.lifeNeed)} is covered`) : "no dependants: little need for life cover yet";
        cards.push({ t: "Life cover", v: c.deps > 0 ? m(c.lifeGap) + " gap" : "not needed yet", s: c.deps > 0 ? (c.lifeGap > 0 ? "act" : "good") : "good", n: lifeText, l: "l09-how-much" });
        cards.push({ t: "Health cover", v: c.health > 0 ? m(c.health) : "none personal", s: c.health >= 500000 ? "good" : c.health > 0 ? "warn" : "act", n: c.healthEmp > 0 ? `plus ${m(c.healthEmp)} employer cover, which ends with the job` : "no employer cover recorded", l: "l09-health" });
        const short = c.goals.filter((g) => !g.ok);
        cards.push({ t: "Goals", v: c.goals.length ? `${c.goals.length - short.length} of ${c.goals.length} funded` : "none set", s: !c.goals.length ? "warn" : short.length === 0 ? "good" : "warn", n: short.length ? `${short.map((g) => `${esc(g.name)} needs ${fmt.inr(g.need)}/mo`).slice(0, 2).join("; ")}` : c.goals.length ? "current saving meets each goal" : "add at least one dated goal", l: "l06-method" });

        // priorities
        const pri = [];
        if (c.expensive.length) pri.push(`Clear expensive debt first: ${c.expensive.map((l) => `${esc(l.name)} at ${num(l.rate)}%`).join(", ")} (Lesson 0.8).`);
        if (c.buffer < c.target) pri.push(`Build the emergency fund by ${m(c.target - c.buffer)} to reach ${fmt.num(num(data.emergency.months), 1)} months of essentials (Lesson 0.7).`);
        if (c.health <= 0) pri.push("Buy personal health cover while healthy; employer cover ends with the job (Lesson 0.9).");
        if (c.deps > 0 && c.lifeGap > 0) pri.push(`Close the life-cover gap of about ${m(c.lifeGap)} with term insurance (Lesson 0.9).`);
        if (c.rate < 0.1 && c.income > 0) pri.push("Raise the savings rate: look at the three largest spending lines and the share of each raise you keep (Lesson 0.2).");
        if (short.length && pri.length < 3) pri.push(`Rebalance goal saving: ${short.length} goal${short.length > 1 ? "s are" : " is"} underfunded at current contributions (Lesson 0.6).`);
        if (!pri.length) pri.push("The foundations look sound. Review every 3 to 6 months and after any major change; Level 2 and Level 8 take the next steps.");

        const alloc = c.alloc.length ? `<div class="p0-alloc" role="img" aria-label="Assets by type: ${c.alloc.map((a) => `${a.label} ${fmt.pct(a.value / c.A, 0)}`).join(", ")}">${c.alloc.map((a, i) => `<span style="width:${(a.value / c.A) * 100}%;background:var(--series-${(i % 3) + 1});opacity:${1 - Math.floor(i / 3) * 0.35}"></span>`).join("")}</div>
          <div class="chart-legend">${c.alloc.map((a, i) => `<span><i class="swatch" style="background:var(--series-${(i % 3) + 1});opacity:${1 - Math.floor(i / 3) * 0.35}"></i>${a.label} ${fmt.pct(a.value / c.A, 0)}</span>`).join("")}</div>` : "";

        $("#p0-summary", root).innerHTML = `
          <div class="p0-cards">${cards.map((k) => `<div class="p0-card"><p class="p0-card-t"><a href="#${k.l}">${k.t}</a></p><p class="p0-card-v">${k.v}</p><p class="p0-card-s">${chip(k.s)}</p><p class="p0-card-n">${k.n}</p></div>`).join("")}</div>
          <div class="p0-lower">
            <div class="p0-pri"><h3>Suggested priorities from your numbers</h3><ol>${pri.slice(0, 4).map((p) => `<li>${p}</li>`).join("")}</ol><p class="hint">Generated by simple rules from Module 0. Your diagnosis below should use judgement, not just these rules.</p></div>
            <div class="p0-allocbox"><h3>What your assets are made of</h3>${alloc || `<p class="hint">Add assets to see the mix.</p>`}</div>
          </div>`;
      }

      function refresh() { summary(); setMode(); }

      form.addEventListener("input", (e) => {
        const el = e.target;
        if (el.dataset.k) setK(el.dataset.k, el.tagName === "TEXTAREA" ? el.value : num(el.value));
        const row = el.closest("[data-list]");
        if (row && el.dataset.f) {
          const item = data[row.dataset.list][+row.dataset.i];
          const f = el.dataset.f;
          item[f] = el.type === "checkbox" ? el.checked : ["name", "band", "type"].includes(f) ? el.value : num(el.value);
        }
        if (data.sample && el.tagName !== "TEXTAREA") { data.sample = false; }
        persist(); summary();
      });
      form.addEventListener("change", (e) => { if (e.target.type === "checkbox" || e.target.tagName === "SELECT") form.dispatchEvent(new Event("input", { bubbles: true })); });
      form.addEventListener("focusout", (e) => {
        const el = e.target;
        if (el.tagName === "INPUT" && el.inputMode === "numeric" && el.value) el.value = fmt.num(num(el.value));
      });
      form.addEventListener("submit", (e) => e.preventDefault());
      form.addEventListener("click", (e) => {
        const add = e.target.closest("[data-add]");
        if (add) {
          const list = add.dataset.add;
          data[list].push(list === "assets" ? { name: "", value: 0, band: "days", type: "cash" } : list === "liabilities" ? { name: "", balance: 0, rate: 0, emi: 0, short: false } : { name: "", cost: 0, years: 5, inflation: 5, ret: 7, saved: 0, monthly: 0 });
          rowsHTML(); persist(); summary();
          const rows = $$(`[data-list="${list}"]`, root); rows[rows.length - 1]?.querySelector("input")?.focus();
          return;
        }
        const del = e.target.closest("[data-del]");
        if (del) {
          const row = del.closest("[data-list]"); const list = row.dataset.list;
          const removed = data[list].splice(+row.dataset.i, 1)[0];
          lastDeleted = { list, index: +row.dataset.i, item: removed };
          rowsHTML(); persist(); summary();
          $(`[data-add="${list}"]`, root).focus();
          showUndo(removed.name || "Item");
        }
      });

      let lastDeleted = null, undoTimer;
      function showUndo(name) {
        const box = $("#p0-undo", root);
        box.innerHTML = `<span>Removed ${esc(name)}.</span> <button type="button" class="btn btn--ghost" id="p0-undo-btn">${FA.icon("arrow-counter-clockwise")} Undo</button>`;
        box.hidden = false;
        $("#p0-undo-btn", root).addEventListener("click", () => {
          if (!lastDeleted) return;
          data[lastDeleted.list].splice(lastDeleted.index, 0, lastDeleted.item);
          lastDeleted = null; box.hidden = true; rowsHTML(); persist(); summary(); FA.toast("Restored");
        });
        clearTimeout(undoTimer); undoTimer = setTimeout(() => { box.hidden = true; lastDeleted = null; }, 10000);
      }
      // Buttons
      const confirmBox = $("#p0-confirm", root);
      let pending = "empty";
      const askConfirm = (kind, text, yes) => { pending = kind; $("#p0-confirm-t", root).textContent = text; $("#p0-confirm-yes", root).textContent = yes; confirmBox.hidden = false; $("#p0-confirm-yes", root).focus(); };
      $("#p0-mine", root).addEventListener("click", () => askConfirm("empty", "Clear the current numbers and start with an empty dashboard? Export a file first if you want to keep them.", "Clear and start"));
      $("#p0-confirm-no", root).addEventListener("click", () => { confirmBox.hidden = true; $("#p0-mine", root).focus(); });
      $("#p0-confirm-yes", root).addEventListener("click", () => {
        confirmBox.hidden = true;
        if (pending === "sample") { data = clone(SAMPLE); fillScalars(); rowsHTML(); persist(); refresh(); $("#p0-sample", root).focus(); FA.toast("Sample loaded"); return; }
        data = clone(EMPTY); fillScalars(); rowsHTML(); persist(); refresh(); $("#p0-takehome", root).focus(); FA.toast("Empty dashboard ready");
      });
      $("#p0-sample", root).addEventListener("click", () => {
        if (data.sample) { FA.toast("The sample is already loaded"); return; }
        askConfirm("sample", "Replace your numbers with Meera’s sample? Export a file first if you want to keep yours.", "Replace with sample");
      });

      $("#p0-export", root).addEventListener("click", async () => {
        const text = JSON.stringify(Object.assign({}, data, { exported: new Date().toISOString(), version: VERSION }), null, 2);
        let dl = null;
        try { dl = window.claude && typeof window.claude.use === "function" ? await window.claude.use("downloads") : null; } catch (e) { dl = null; }
        const fb = $("#p0-fallback", root);
        if (dl) {
          try { await dl.save({ filename: "project0-dashboard.json", data: text }); FA.toast("Saved"); fb.hidden = true; return; }
          catch (err) { if (err && err.code === "declined") { FA.toast("Save cancelled"); return; } }
        }
        $("#p0-fallback-text", root).value = text; fb.hidden = false; $("#p0-fallback-text", root).focus();
      });
      const fileIn = $("#p0-import", root);
      $("#p0-import-btn", root).addEventListener("click", () => fileIn.click());
      fileIn.addEventListener("change", () => {
        const f = fileIn.files && fileIn.files[0]; if (!f) return;
        const rd = new FileReader();
        rd.onload = () => {
          try { data = validate(JSON.parse(rd.result)); data.sample = false; fillScalars(); rowsHTML(); persist(); refresh(); FA.toast("Imported"); }
          catch (e) { setMode(`Could not import: ${e.message} Choose a file exported from this dashboard.`); }
          fileIn.value = "";
        };
        rd.onerror = () => setMode("Could not read that file. Try exporting again.");
        rd.readAsText(f);
      });

      fillScalars(); rowsHTML(); refresh();
    };
  }
})();
