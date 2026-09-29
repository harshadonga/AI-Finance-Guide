/* =====================================================================
   AI-Powered Finance Academy: course runtime v1.0
   Shared by every module. No dependencies.
   Provides: formatting (Indian conventions), lesson router, rail,
   theme, glossary, knowledge checks, predict-then-reveal, practice
   progress, learner notes, toasts.
   Documentation: foundations/05_COMPONENT_LIBRARY.md
   ===================================================================== */
(function () {
  "use strict";

  const FA = (window.FA = window.FA || {});
  const APP = document.getElementById("app");
  const MODULE = (APP && APP.dataset.module) || "m00";

  /* ---------------- Storage (per-viewer conveniences only) ---------------- */
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(`fa:${key}`); return v == null ? fallback : JSON.parse(v); }
      catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(`fa:${key}`, JSON.stringify(value)); return true; }
      catch (e) { return false; }
    },
  };
  FA.store = store;

  /* ---------------- Formatting (Teaching Spec §26) ---------------- */
  const inr0 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
  const fmt = {
    /** ₹1,23,456 (Indian digit grouping) */
    inr(n) {
      if (!isFinite(n)) return "n/a";
      const s = inr0.format(Math.round(Math.abs(n)));
      return (n < 0 ? "−₹" : "₹") + s;
    },
    /** ₹12.4 lakh / ₹1.25 crore / ₹85,000 */
    inrShort(n, dp) {
      if (!isFinite(n)) return "n/a";
      const a = Math.abs(n), sign = n < 0 ? "−" : "";
      if (a >= 1e7) return `${sign}₹${trim((a / 1e7).toFixed(dp ?? 2))} crore`;
      if (a >= 1e5) return `${sign}₹${trim((a / 1e5).toFixed(dp ?? 2))} lakh`;
      return sign + "₹" + inr0.format(Math.round(a));
    },
    /** Axis-friendly compact: ₹12L, ₹1.2Cr, ₹50k */
    inrAxis(n) {
      const a = Math.abs(n), sign = n < 0 ? "−" : "";
      if (a >= 1e7) return `${sign}₹${trim((a / 1e7).toFixed(a >= 1e8 ? 0 : 1))}Cr`;
      if (a >= 1e5) return `${sign}₹${trim((a / 1e5).toFixed(a >= 1e6 ? 0 : 1))}L`;
      if (a >= 1e3) return `${sign}₹${trim((a / 1e3).toFixed(0))}k`;
      return sign + "₹" + Math.round(a);
    },
    pct(x, dp = 1) {
      if (!isFinite(x)) return "n/a";
      const v = (x * 100).toFixed(dp);
      return (x < 0 ? "−" : "") + v.replace("-", "") + "%";
    },
    num(n, dp = 0) { return isFinite(n) ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: dp, minimumFractionDigits: dp }).format(n) : "n/a"; },
    months(m) {
      if (!isFinite(m)) return "never";
      const y = Math.floor(m / 12), r = Math.round(m % 12);
      if (y === 0) return `${r} month${r === 1 ? "" : "s"}`;
      if (r === 0) return `${y} year${y === 1 ? "" : "s"}`;
      return `${y} yr ${r} mo`;
    },
  };
  function trim(s) { return s.includes(".") ? s.replace(/\.?0+$/, "") : s; }
  FA.fmt = fmt;

  /* ---------------- Tiny DOM helpers ---------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  FA.$ = $; FA.$$ = $$;
  FA.icon = (name, cls = "icon") => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;
  FA.reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Toast ---------------- */
  let toastTimer;
  FA.toast = function (msg) {
    let t = $("#fa-toast");
    if (!t) { t = document.createElement("div"); t.id = "fa-toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 2600);
  };

  /* ---------------- Progress ---------------- */
  const progKey = `${MODULE}:progress`;
  const progress = store.get(progKey, { visited: {}, quiz: {} });
  progress.visited = progress.visited || {}; progress.quiz = progress.quiz || {};
  function saveProgress() { store.set(progKey, progress); }
  FA.progress = progress;

  /* ---------------- Router ---------------- */
  const lessons = $$("[data-lesson]");
  const lessonIds = lessons.map((l) => l.id);
  let current = null;

  function lessonFor(token) {
    if (!token) return null;
    const el = document.getElementById(token);
    if (!el) return null;
    return el.matches("[data-lesson]") ? el : el.closest("[data-lesson]");
  }

  function show(token, { focus = true, fromHash = true } = {}) {
    const target = token ? document.getElementById(token) : null;
    const lesson = lessonFor(token) || lessons[0];
    if (!lesson) return;
    const changed = current !== lesson;
    if (changed) {
      lessons.forEach((l) => (l.hidden = l !== lesson));
      current = lesson;
      if (!FA.reducedMotion()) { lesson.setAttribute("data-entering", ""); setTimeout(() => lesson.removeAttribute("data-entering"), 320); }
      document.title = `${lesson.dataset.title || "Lesson"} · ${(APP && APP.dataset.moduleTitle) || "Finance Academy"}`;
      progress.visited[lesson.id] = true; saveProgress();
      updateRail(); updateLessonNav(); updateMeter();
      document.dispatchEvent(new CustomEvent("fa:lesson", { detail: { id: lesson.id, el: lesson } }));
    }
    closeRail();
    if (target && target !== lesson) {
      requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    } else if (changed) {
      window.scrollTo(0, 0);
      if (focus && fromHash) { const h = lesson.querySelector("h1"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); } }
    }
  }
  FA.show = show;

  window.addEventListener("hashchange", () => show(location.hash.slice(1)));

  function updateRail() {
    $$(".rail a[href^='#']").forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      if (current && id === current.id) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      const st = a.querySelector(".rail-status");
      if (st) st.hidden = !lessonComplete(id);
    });
  }
  function lessonComplete(id) {
    const l = document.getElementById(id);
    if (!l || !progress.visited[id]) return false;
    const qs = $$("[data-quiz]", l).map((q) => q.dataset.id);
    if (!qs.length) return true;
    return qs.every((qid) => progress.quiz[qid]);
  }
  function updateMeter() {
    const done = lessonIds.filter(lessonComplete).length;
    $$("[data-meter]").forEach((m) => {
      const fill = m.querySelector(".meter-fill"); const label = m.querySelector(".meter-label");
      if (fill) fill.style.transform = `scaleX(${done / lessonIds.length})`;
      if (label) label.textContent = `${done} of ${lessonIds.length} complete`;
      m.setAttribute("aria-valuenow", String(done));
    });
  }
  FA.refreshProgress = () => { updateRail(); updateMeter(); };

  function updateLessonNav() {
    const i = lessons.indexOf(current);
    $$("[data-lesson-nav]").forEach((nav) => {
      const prev = lessons[i - 1], next = lessons[i + 1];
      nav.innerHTML =
        (prev ? `<a class="prev" href="#${prev.id}"><span>${FA.icon("arrow-left")} Previous</span><strong>${prev.dataset.navTitle || prev.dataset.title}</strong></a>` : "<span></span>") +
        (next ? `<a class="next" href="#${next.id}"><span>Next ${FA.icon("arrow-right")}</span><strong>${next.dataset.navTitle || next.dataset.title}</strong></a>` : "");
    });
  }

  /* ---------------- Rail (mobile drawer) ---------------- */
  const rail = $("#rail"), menuBtn = $("#menu-btn");
  function closeRail() {
    if (!rail || !rail.classList.contains("is-open")) return;
    rail.classList.remove("is-open"); menuBtn && menuBtn.setAttribute("aria-expanded", "false");
  }
  if (menuBtn && rail) {
    menuBtn.addEventListener("click", () => {
      const open = !rail.classList.contains("is-open");
      rail.classList.toggle("is-open", open); menuBtn.setAttribute("aria-expanded", String(open));
      if (open) { const a = rail.querySelector("[aria-current]") || rail.querySelector("a"); a && a.focus(); }
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && rail.classList.contains("is-open")) { closeRail(); menuBtn.focus(); } });
    document.addEventListener("click", (e) => { if (rail.classList.contains("is-open") && !rail.contains(e.target) && !menuBtn.contains(e.target)) closeRail(); });
  }

  /* ---------------- Theme ---------------- */
  const themeBtn = $("#theme-btn");
  const THEMES = ["system", "light", "dark"];
  function applyTheme(t) {
    if (t === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", `Colour theme: ${t}. Change theme`);
      themeBtn.innerHTML = FA.icon(t === "dark" ? "moon" : t === "light" ? "sun" : "circle-half");
      themeBtn.title = `Theme: ${t}`;
    }
    document.dispatchEvent(new CustomEvent("fa:theme"));
  }
  let theme = store.get("theme", "system");
  if (!THEMES.includes(theme)) theme = "system";
  applyTheme(theme);
  themeBtn && themeBtn.addEventListener("click", () => {
    theme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    store.set("theme", theme); applyTheme(theme); FA.toast(`Theme: ${theme}`);
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => document.dispatchEvent(new CustomEvent("fa:theme")));

  /* ---------------- Glossary ---------------- */
  const G = window.GLOSSARY || {};
  let pop = null, popFor = null;
  function closePop(returnFocus) {
    if (!pop) return; pop.remove(); pop = null;
    if (popFor) { popFor.setAttribute("aria-expanded", "false"); if (returnFocus) popFor.focus(); }
    popFor = null;
  }
  function openPop(btn) {
    const id = btn.dataset.term, g = G[id];
    if (!g) return;
    closePop();
    pop = document.createElement("div");
    pop.className = "pop"; pop.id = "term-pop"; pop.setAttribute("role", "dialog"); pop.setAttribute("aria-label", g.term);
    pop.innerHTML = `<h3>${g.term}</h3><p>${g.def}</p>${g.intuition ? `<p><strong>Intuition.</strong> ${g.intuition}</p>` : ""}
      <p class="meta">First introduced in Lesson ${g.module}${g.related?.length ? ` · Related: ${g.related.map((r) => G[r]?.term || r).join(", ")}` : ""}</p>`;
    document.body.appendChild(pop);
    const r = btn.getBoundingClientRect(), pw = pop.offsetWidth;
    let left = r.left + window.scrollX; left = Math.min(left, window.scrollX + document.documentElement.clientWidth - pw - 16); left = Math.max(window.scrollX + 16, left);
    pop.style.left = `${left}px`; pop.style.top = `${r.bottom + window.scrollY + 8}px`;
    btn.setAttribute("aria-expanded", "true"); btn.setAttribute("aria-controls", "term-pop"); popFor = btn;
  }
  document.addEventListener("click", (e) => {
    const t = e.target.closest(".term");
    if (t) { e.preventDefault(); if (popFor === t) closePop(); else openPop(t); return; }
    if (pop && !pop.contains(e.target)) closePop();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && pop) closePop(true); });
  // Decorate terms
  $$(".term").forEach((t) => { if (t.tagName !== "BUTTON") return; t.type = "button"; t.setAttribute("aria-expanded", "false"); if (!G[t.dataset.term]) console.warn("Glossary term missing:", t.dataset.term); });

  const panel = $("#glossary-panel");
  function renderGlossary(q = "") {
    const list = $("#glossary-list"); if (!list) return;
    const needle = q.trim().toLowerCase();
    const items = Object.entries(G).filter(([, g]) => !needle || g.term.toLowerCase().includes(needle) || g.def.toLowerCase().includes(needle))
      .sort((a, b) => a[1].term.localeCompare(b[1].term));
    list.innerHTML = items.length ? items.map(([id, g]) => `<div class="gl-entry" id="gl-${id}"><h3>${g.term}</h3><p>${g.def}</p>${g.intuition ? `<p>${g.intuition}</p>` : ""}<p class="meta">Lesson ${g.module}</p></div>`).join("")
      : `<p class="source-note">No term matches “${q}”. Try a shorter word, such as “rate” or “value”.</p>`;
    const c = $("#glossary-count"); if (c) c.textContent = `${items.length} term${items.length === 1 ? "" : "s"}`;
  }
  $$("[data-open-glossary]").forEach((b) => b.addEventListener("click", () => { renderGlossary($("#glossary-search")?.value || ""); panel.showModal(); $("#glossary-search")?.focus(); }));
  $("#glossary-search")?.addEventListener("input", (e) => renderGlossary(e.target.value));
  $("#glossary-close")?.addEventListener("click", () => panel.close());
  panel?.addEventListener("click", (e) => { if (e.target === panel) panel.close(); });

  /* ---------------- Knowledge checks & predictions ---------------- */
  function initQuiz(q) {
    const kind = q.dataset.quiz || "choice"; // choice | numeric
    const isPredict = q.hasAttribute("data-predict");
    const fb = q.querySelector(".q-feedback");
    const btn = q.querySelector("[data-check]");
    const retry = q.querySelector("[data-retry]");
    const qid = q.dataset.id;

    function verdict(ok, text) {
      return `<p class="q-verdict ${ok ? "is-right" : "is-wrong"}">${FA.icon(ok ? "check-circle" : "x-circle")} ${text}</p>`;
    }

    function check() {
      let ok, html = "";
      if (kind === "numeric") {
        const inp = q.querySelector("input");
        const raw = (inp.value || "").replace(/[,₹%\s]/g, "");
        if (raw === "" || isNaN(+raw)) { fb.innerHTML = `<p>Enter a number first. Leave out ₹ and commas if you like.</p>`; inp.focus(); return; }
        const ans = +q.dataset.answer, tol = +(q.dataset.tol || 0.01 * Math.abs(ans));
        ok = Math.abs(+raw - ans) <= tol;
        html = verdict(ok, ok ? "Correct." : `Not quite. The answer is ${q.dataset.answerText || ans}.`);
      } else {
        const chosen = q.querySelector("input:checked");
        if (!chosen) { fb.innerHTML = `<p>Choose an option first.</p>`; return; }
        const opt = chosen.closest(".q-opt");
        ok = opt.hasAttribute("data-correct");
        $$(".q-opt", q).forEach((o) => {
          o.removeAttribute("data-state");
          const mark = o.querySelector(".q-mark"); if (mark) mark.innerHTML = "";
        });
        const correct = q.querySelector(".q-opt[data-correct]");
        correct.dataset.state = "correct"; correct.querySelector(".q-mark").innerHTML = `${FA.icon("check")} ${isPredict ? "Answer" : "Correct"}`;
        if (!ok) { opt.dataset.state = "wrong"; opt.querySelector(".q-mark").innerHTML = `${FA.icon("x")} ${isPredict ? "Your prediction" : "Your answer"}`; }
        const why = opt.querySelector(".q-why");
        html = isPredict
          ? verdict(ok, ok ? "Your prediction was right." : "Your prediction was off. That is useful: now look at why.")
          : verdict(ok, ok ? "Correct." : "Not quite.");
        if (why) html += `<div>${why.innerHTML}</div>`;
      }
      const explain = q.querySelector(".q-explain");
      if (explain) html += `<div>${explain.innerHTML}</div>`;
      fb.innerHTML = html;
      $$(".reveal", q).forEach((r) => (r.hidden = false));
      if (q.dataset.reveals) { const r = document.getElementById(q.dataset.reveals); if (r) r.hidden = false; }
      if (!isPredict && qid) { progress.quiz[qid] = progress.quiz[qid] || { attempts: 0 }; progress.quiz[qid].attempts++; if (ok) progress.quiz[qid].correct = true; progress.quiz[qid].last = ok; saveProgress(); FA.refreshProgress(); }
      q.dataset.answered = ok ? "right" : "wrong";
      if (retry) retry.hidden = false;
      if (btn && isPredict) { btn.disabled = true; btn.textContent = "Prediction locked"; }
      document.dispatchEvent(new CustomEvent("fa:answered", { detail: { id: qid, ok, el: q } }));
    }
    btn && btn.addEventListener("click", check);
    q.querySelector("input[type=text], input[inputmode]")?.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); check(); } });
    retry && retry.addEventListener("click", () => {
      $$(".q-opt", q).forEach((o) => { o.removeAttribute("data-state"); const m = o.querySelector(".q-mark"); if (m) m.innerHTML = ""; });
      $$("input", q).forEach((i) => { if (i.type === "radio") i.checked = false; else i.value = ""; });
      fb.innerHTML = ""; retry.hidden = true; delete q.dataset.answered;
      (q.querySelector("input") || btn).focus();
    });
  }
  $$("[data-quiz]").forEach(initQuiz);

  /* Assessment summary: groups answered checks by competency */
  $$("[data-assessment]").forEach((box) => {
    const btn = box.querySelector("[data-score]"); const out = box.querySelector("[data-score-out]");
    if (!btn || !out) return;
    btn.addEventListener("click", () => {
      const comps = {};
      $$("[data-quiz]", box).forEach((q) => {
        const c = q.dataset.comp || "Understanding";
        comps[c] = comps[c] || { n: 0, right: 0, answered: 0 };
        comps[c].n++;
        if (q.dataset.answered) comps[c].answered++;
        if (q.dataset.answered === "right") comps[c].right++;
      });
      const totalAns = Object.values(comps).reduce((s, c) => s + c.answered, 0);
      const total = Object.values(comps).reduce((s, c) => s + c.n, 0);
      const rows = Object.entries(comps).map(([c, v]) => {
        const pct = v.n ? v.right / v.n : 0;
        const state = pct >= 0.8 ? "Secure" : pct >= 0.5 ? "Developing" : "Revisit";
        return `<tr><th scope="row">${c}</th><td class="r">${v.right} / ${v.n}</td><td>${state}</td><td>${(box.dataset["revisit" + c.replace(/\s/g, "")] || "")}</td></tr>`;
      }).join("");
      out.innerHTML = `<p class="insight">You have answered <b>${totalAns} of ${total}</b> questions${totalAns < total ? ". Unanswered questions count as not yet secure." : "."}</p>
        <div class="table-wrap"><table><caption>Results by competency</caption><thead><tr><th>Competency</th><th class="r">Correct</th><th>Status</th><th>If not secure, revisit</th></tr></thead><tbody>${rows}</tbody></table></div>
        <p class="source-note">Status: Secure = 80% or more, Developing = 50 to 79%, Revisit = below 50%. This is a recommendation, not a lock: you can continue to Module 1 either way.</p>`;
      out.hidden = false; out.focus();
    });
  });

  /* ---------------- Learner notes ---------------- */
  $$("textarea[data-notes]").forEach((ta) => {
    const key = `${MODULE}:notes:${ta.dataset.notes}`;
    const status = ta.closest(".notes")?.querySelector("[data-notes-status]");
    ta.value = store.get(key, "");
    let t;
    ta.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const ok = store.set(key, ta.value);
        if (status) status.textContent = ok ? "Saved in this browser." : "This browser is not allowing saved notes (private window or blocked storage). Copy anything you want to keep.";
      }, 400);
    });
  });

  /* ---------------- Copy buttons ---------------- */
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-copy]"); if (!b) return;
    const src = document.getElementById(b.dataset.copy); if (!src) return;
    const text = (src.tagName === "TEXTAREA" || src.tagName === "INPUT") ? src.value : src.innerText;
    try { await navigator.clipboard.writeText(text); FA.toast("Copied"); }
    catch (err) { const r = document.createRange(); r.selectNodeContents(src); const s = getSelection(); s.removeAllRanges(); s.addRange(r); FA.toast("Selected. Press Ctrl+C or ⌘C to copy."); }
  });

  /* ---------------- Boot ---------------- */
  FA.boot = function () {
    show(location.hash.slice(1), { focus: false, fromHash: false });
  };
})();
