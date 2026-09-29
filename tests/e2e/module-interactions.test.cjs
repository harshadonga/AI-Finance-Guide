// Interaction QA: visits every lesson, exercises every control, checks for
// errors, broken readouts, overflow, and basic accessibility invariants.
// Run: node tests/e2e/module-interactions.test.cjs [module-id] [width]
const { chromium } = require("playwright-core");
const path = require("path");
const { browserExecutable } = require("./browser.cjs");
(async () => {
  const moduleId = process.argv[2] || "module-00";
  const width = +(process.argv[3] || 1280);
  const browser = await chromium.launch({ executablePath: browserExecutable() });
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error" && !/ERR_TUNNEL|Failed to load resource/.test(m.text())) errors.push(m.text()); if (m.type() === "warning") errors.push("warn: " + m.text()); });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  const url = "file://" + path.resolve(__dirname, `../../dist/${moduleId}/preview.html`);
  await page.goto(url + "#m0");
  await page.waitForTimeout(500);
  const ids = await page.$$eval("[data-lesson]", (els) => els.map((e) => e.id));
  const report = [];
  for (const id of ids) {
    await page.evaluate((h) => (location.hash = h), id);
    await page.waitForTimeout(250);
    const r = await page.evaluate(async (id) => {
      const L = document.getElementById(id);
      const issues = [];
      if (L.hidden) issues.push("lesson hidden after navigation");
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const bad = () => Array.from(L.querySelectorAll(".readout-value, .insight, output, .p0-card-v")).filter((e) => /NaN|undefined|Infinity|null/.test(e.textContent)).map((e) => (e.id || e.className) + ": " + e.textContent.slice(0, 60));
      // ranges: sweep min, max, mid
      const ranges = Array.from(L.querySelectorAll('input[type="range"]'));
      for (const inp of ranges) {
        const orig = inp.value;
        for (const v of [inp.min, inp.max, orig]) { inp.value = v; inp.dispatchEvent(new Event("input", { bubbles: true })); }
        const b = bad(); if (b.length) issues.push(`range ${inp.id} → ${b.join(" | ")}`);
      }
      // extreme combination: all to max, then all to min
      for (const which of ["max", "min"]) {
        ranges.forEach((inp) => { inp.value = inp[which]; inp.dispatchEvent(new Event("input", { bubbles: true })); });
        const b = bad(); if (b.length) issues.push(`all ranges ${which} → ${b.join(" | ")}`);
      }
      ranges.forEach((inp) => { inp.value = inp.defaultValue; inp.dispatchEvent(new Event("input", { bubbles: true })); });
      // selects and checkboxes and seg buttons
      L.querySelectorAll("select.input").forEach((s) => { Array.from(s.options).forEach((o) => { s.value = o.value; s.dispatchEvent(new Event("change", { bubbles: true })); }); });
      L.querySelectorAll('.bench input[type="checkbox"]').forEach((c) => { c.click(); c.click(); });
      L.querySelectorAll(".seg button").forEach((b) => b.click());
      L.querySelectorAll(".seg").forEach((g) => g.querySelector("button").click());
      const b2 = bad(); if (b2.length) issues.push("after toggles → " + b2.join(" | "));
      // quizzes
      let quizzes = 0;
      for (const q of L.querySelectorAll("[data-quiz]")) {
        quizzes++;
        const btn = q.querySelector("[data-check]");
        btn.click(); // no selection: should prompt, not crash
        const fb = q.querySelector(".q-feedback");
        if (!fb.textContent.trim()) issues.push(`quiz ${q.dataset.id}: no prompt when unanswered`);
        if (q.dataset.quiz === "numeric") {
          const inp = q.querySelector("input"); inp.value = q.dataset.answer; btn.click();
          if (q.dataset.answered !== "right") issues.push(`numeric ${q.dataset.id}: own answer ${q.dataset.answer} not accepted`);
          const expl = q.querySelector(".q-explain"); if (expl && !expl.textContent.replace(/,/g, "").includes(q.dataset.answerText.replace("₹", "").split(" ")[0].replace(/[^\d.]/g, "").slice(0, 3))) issues.push(`numeric ${q.dataset.id}: explanation may not match answer ${q.dataset.answerText}`);
        } else {
          const correct = q.querySelector(".q-opt[data-correct] input"); const wrong = q.querySelector(".q-opt:not([data-correct]) input");
          if (!correct) { issues.push(`quiz ${q.dataset.id}: no correct option`); continue; }
          if (wrong && !q.hasAttribute("data-predict")) { wrong.click(); btn.click(); if (q.dataset.answered !== "wrong") issues.push(`quiz ${q.dataset.id}: wrong not marked`); if (!fb.innerHTML.includes("q-verdict")) issues.push(`quiz ${q.dataset.id}: no feedback`); const retry = q.querySelector("[data-retry]"); retry && retry.click(); }
          correct.click(); btn.click();
          if (q.dataset.answered !== "right") issues.push(`quiz ${q.dataset.id}: correct not accepted`);
          if (q.hasAttribute("data-predict") && q.querySelector(".reveal") && q.querySelector(".reveal").hidden) issues.push(`predict ${q.dataset.id}: reveal still hidden`);
        }
      }
      // ladders
      L.querySelectorAll("details").forEach((d) => { d.open = true; });
      // accessibility invariants
      L.querySelectorAll("input, select, textarea").forEach((el) => {
        if (el.type === "hidden" || el.hidden || el.type === "file") return;
        const id = el.id; const lab = id && document.querySelector(`label[for="${id}"]`);
        const wrapped = el.closest("label");
        if (!lab && !wrapped && !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby")) issues.push(`unlabelled control ${el.id || el.name || el.type}`);
      });
      L.querySelectorAll("img:not([alt])").forEach(() => issues.push("img without alt"));
      L.querySelectorAll("button").forEach((b) => { if (!b.textContent.trim() && !b.getAttribute("aria-label")) issues.push("button without name: " + b.outerHTML.slice(0, 80)); });
      const h1 = L.querySelectorAll("h1").length; if (h1 !== 1) issues.push(`h1 count ${h1}`);
      // heading order
      let last = 1; L.querySelectorAll("h1,h2,h3,h4").forEach((h) => { const n = +h.tagName[1]; if (n > last + 1) issues.push(`heading jump h${last}→h${n}: ${h.textContent.slice(0, 40)}`); last = n; });
      await sleep(50);
      const ov = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      if (ov > 0) issues.push(`horizontal overflow ${ov}px`);
      // small text check: content text below 13px
      const small = Array.from(L.querySelectorAll("p, li, td, th, label, span, a, button")).filter((e) => e.offsetParent && e.childNodes.length && Array.from(e.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 12.9).map((e) => e.className || e.tagName);
      if (small.length) issues.push(`text below 13px: ${[...new Set(small)].slice(0, 5).join(", ")}`);
      return { id, quizzes, ranges: ranges.length, issues };
    }, id);
    report.push(r);
  }
  // global features
  const g = await page.evaluate(async () => {
    const out = [];
    document.querySelector("[data-open-glossary]").click();
    await new Promise((r) => setTimeout(r, 100));
    const dlg = document.getElementById("glossary-panel");
    if (!dlg.open) out.push("glossary did not open");
    const n = document.querySelectorAll(".gl-entry").length; if (n < 50) out.push("glossary entries " + n);
    const s = document.getElementById("glossary-search"); s.value = "zzzz"; s.dispatchEvent(new Event("input"));
    if (!document.getElementById("glossary-list").textContent.includes("No term")) out.push("glossary empty state missing");
    dlg.close();
    location.hash = "l04"; await new Promise((r) => setTimeout(r, 150));
    const t = document.querySelector("#l04 .term"); t.click(); await new Promise((r) => setTimeout(r, 50));
    if (!document.getElementById("term-pop")) out.push("term popover missing");
    document.body.click();
    const th = document.getElementById("theme-btn"); th.click(); const a = document.documentElement.getAttribute("data-theme"); th.click(); const b = document.documentElement.getAttribute("data-theme"); th.click();
    if (a !== "light" || b !== "dark") out.push(`theme cycle ${a},${b}`);
    return out;
  });
  let total = 0;
  report.forEach((r) => { total += r.issues.length; console.log(`${r.issues.length ? "✗" : "✓"} ${r.id.padEnd(10)} ranges:${r.ranges} quizzes:${r.quizzes}`); r.issues.forEach((i) => console.log("    - " + i)); });
  console.log("global:", g.length ? g : "ok");
  console.log("console errors:", errors.length ? errors.slice(0, 20) : "none");
  const issueCount = total + g.length + errors.length;
  console.log(`TOTAL ISSUES: ${issueCount}`);
  if (issueCount) process.exitCode = 1;
  await browser.close();
})();
