/* =====================================================================
   AI-Powered Finance Academy: chart component v1.0 (InteractiveChart)
   Minimal SVG charts that follow the course chart standard
   (Teaching Spec §15, dataviz marks spec):
   - line (2px), area (10-14% wash) and stacked area, columns (<= 24px,
     4px rounded data-end), reference lines, direct end labels
   - hover/keyboard crosshair tooltip, legend for >= 2 series,
     text description and data table for every chart
   All colours are CSS tokens, so charts follow the theme.
   ===================================================================== */
(function () {
  "use strict";
  const FA = (window.FA = window.FA || {});
  let uid = 0;

  function niceStep(range, target) {
    const raw = range / Math.max(1, target);
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const n = raw / mag;
    const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
    return step * mag;
  }
  function ticks(min, max, target) {
    if (max === min) { max = min + 1; }
    const step = niceStep(max - min, target);
    const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step;
    const out = [];
    for (let v = lo; v <= hi + step * 1e-9; v += step) out.push(+v.toFixed(10));
    return out;
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function Chart(el, spec) {
    this.el = el; this.id = `ch${++uid}`; this.spec = spec; this.idx = null;
    el.classList.add("chart");
    el.innerHTML = `<div class="chart-plot" style="position:relative"></div><div class="chart-legend"></div>
      <details class="chart-table"><summary>Show the numbers as a table</summary><div class="table-wrap"></div></details>`;
    this.plot = el.querySelector(".chart-plot");
    this.legend = el.querySelector(".chart-legend");
    this.tableWrap = el.querySelector(".table-wrap");
    this.render();
    if ("ResizeObserver" in window) {
      let w = el.clientWidth;
      this.ro = new ResizeObserver(() => { if (Math.abs(el.clientWidth - w) > 4) { w = el.clientWidth; this.render(); } });
      this.ro.observe(el);
    }
  }

  Chart.prototype.update = function (spec) { this.spec = Object.assign({}, this.spec, spec); this.render(); };

  Chart.prototype.render = function () {
    const s = this.spec, el = this.el;
    const W = Math.max(280, el.clientWidth || 600);
    const narrow = W < 480;
    const H = s.height ? (narrow ? Math.round(s.height * 0.82) : s.height) : narrow ? 220 : 280;
    const xs = s.x.values; const n = xs.length;
    const series = s.series.filter((se) => !se.hidden);
    const yfmt = s.y.fmt || ((v) => String(v));
    const xfmt = s.x.fmt || ((v) => String(v));
    const isBars = s.type === "bars";

    // stacked accumulation
    const stackBase = new Array(n).fill(0);
    const drawn = series.map((se) => {
      const vals = se.values.map((v) => (v == null || !isFinite(v) ? null : v));
      if (se.stack) {
        const lo = stackBase.slice(); const hi = vals.map((v, i) => (lo[i] + (v || 0)));
        hi.forEach((v, i) => (stackBase[i] = v));
        return { se, lo, hi, vals };
      }
      return { se, lo: null, hi: vals, vals };
    });
    let ymin = s.y.min != null ? s.y.min : Math.min(0, ...drawn.flatMap((d) => d.hi.filter((v) => v != null)));
    let ymax = s.y.max != null ? s.y.max : Math.max(...drawn.flatMap((d) => d.hi.filter((v) => v != null)), s.refLine ? s.refLine.y : -Infinity);
    if (!isFinite(ymax)) ymax = 1;
    if (ymin === ymax) ymax = ymin + 1;
    const yt = ticks(ymin, ymax, narrow ? 4 : 5);
    ymin = Math.min(ymin, yt[0]); ymax = yt[yt.length - 1];

    const ylabW = Math.max(...yt.map((v) => yfmt(v).length)) * 7 + 12;
    const endLabelW = !narrow && s.endLabels ? 96 : 0;
    const m = { t: 14, r: 14 + endLabelW, b: s.x.label ? 44 : 28, l: Math.max(40, ylabW) };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const band = iw / n;
    const X = isBars ? (i) => m.l + band * (i + 0.5) : (i) => m.l + (n === 1 ? iw / 2 : (iw * i) / (n - 1));
    const Y = (v) => m.t + ih - ((v - ymin) / (ymax - ymin)) * ih;

    let g = "";
    // grid + y ticks
    g += `<g class="grid">` + yt.map((v) => `<line x1="${m.l}" x2="${m.l + iw}" y1="${Y(v)}" y2="${Y(v)}"/>`).join("") + `</g>`;
    g += yt.map((v) => `<text x="${m.l - 8}" y="${Y(v) + 4}" text-anchor="end">${esc(yfmt(v))}</text>`).join("");
    // x ticks
    const maxLabels = Math.max(2, Math.floor(iw / (narrow ? 52 : 64)));
    const every = s.x.every || Math.max(1, Math.ceil(n / maxLabels));
    for (let i = 0; i < n; i++) {
      if (i % every !== 0 && i !== n - 1) continue;
      if (i !== n - 1 && n - 1 - i < every * 0.6 && !isBars) continue;
      g += `<text x="${X(i)}" y="${m.t + ih + 18}" text-anchor="middle">${esc(xfmt(xs[i], i))}</text>`;
    }
    if (s.x.label) g += `<text x="${m.l + iw / 2}" y="${H - 6}" text-anchor="middle">${esc(s.x.label)}</text>`;
    // baseline
    const base = Y(Math.max(ymin, 0));
    g += `<line class="axis-line" x1="${m.l}" x2="${m.l + iw}" y1="${base}" y2="${base}"/>`;

    // marks
    if (isBars) {
      const groups = [];
      drawn.forEach((d) => { const key = d.se.stack ? "stack" : d.se.name; if (!groups.includes(key)) groups.push(key); });
      const gw = Math.min(24 * groups.length + 2 * (groups.length - 1), band * 0.72);
      const bw = Math.min(24, (gw - 2 * (groups.length - 1)) / groups.length);
      drawn.forEach((d) => {
        const gi = groups.indexOf(d.se.stack ? "stack" : d.se.name);
        const col = `var(${d.se.color || "--series-1"})`;
        for (let i = 0; i < n; i++) {
          if (d.vals[i] == null) continue;
          const lo = d.lo ? d.lo[i] : 0, hi = d.hi[i];
          const x0 = X(i) - (groups.length * bw + 2 * (groups.length - 1)) / 2 + gi * (bw + 2);
          let y0 = Y(Math.max(lo, hi)), y1 = Y(Math.min(lo, hi));
          const isTop = !d.se.stack || drawn.filter((o) => o.se.stack).slice(-1)[0] === d;
          if (d.se.stack && !isTop) y0 += 1; // 2px surface gap between stacked segments
          if (d.se.stack && lo > 0) y1 -= 1;
          const h = Math.max(0, y1 - y0);
          const r = isTop ? Math.min(4, h, bw / 2) : 0;
          const up = hi >= lo;
          const path = up
            ? `M${x0},${y1}V${y0 + r}q0,-${r} ${r},-${r}h${bw - 2 * r}q${r},0 ${r},${r}V${y1}Z`
            : `M${x0},${y0}V${y1 - r}q0,${r} ${r},${r}h${bw - 2 * r}q${r},0 ${r},-${r}V${y0}Z`;
          g += `<path d="${path}" style="fill:${col}"/>`;
          if (s.barLabels && !d.se.stack) g += `<text x="${x0 + bw / 2}" y="${Math.min(y0, base) - 6}" text-anchor="middle" class="annot">${esc((s.barLabelFmt || yfmt)(d.vals[i]))}</text>`;
        }
      });
    } else {
      drawn.forEach((d) => {
        const col = `var(${d.se.color || "--series-1"})`;
        const pts = d.hi.map((v, i) => (v == null ? null : [X(i), Y(v)]));
        const valid = pts.filter(Boolean);
        if (!valid.length) return;
        if (d.se.kind === "area" || d.se.stack) {
          const lower = d.lo ? d.lo.map((v, i) => [X(i), Y(v)]) : pts.map((p, i) => [X(i), base]);
          const top = valid.map((p) => p.join(",")).join(" L");
          const bot = lower.slice().reverse().map((p) => p.join(",")).join(" L");
          g += `<path d="M${top} L${bot} Z" style="fill:${col};fill-opacity:${d.se.stack ? 0.22 : 0.12}"/>`;
        }
        const dash = d.se.dashed ? `stroke-dasharray="6 5"` : "";
        g += `<path d="M${valid.map((p) => p.join(",")).join(" L")}" fill="none" style="stroke:${col}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" ${dash}/>`;
        if (s.endLabels && !narrow) {
          const last = valid[valid.length - 1];
          g += `<circle cx="${last[0]}" cy="${last[1]}" r="4" style="fill:${col};stroke:var(--surface)" stroke-width="2"/>`;
          g += `<text x="${last[0] + 8}" y="${last[1] + 4}" class="annot">${esc(d.se.endLabel || d.se.name)}</text>`;
        }
      });
    }
    // reference line
    if (s.refLine) {
      const y = Y(s.refLine.y);
      g += `<line x1="${m.l}" x2="${m.l + iw}" y1="${y}" y2="${y}" style="stroke:var(--ink-3)" stroke-width="1" stroke-dasharray="3 4"/>`;
      g += `<text x="${m.l + 6}" y="${y - 6}" class="annot" style="fill:var(--ink-2)">${esc(s.refLine.label)}</text>`;
    }
    // annotations
    (s.annotations || []).forEach((a) => {
      if (a.i == null || a.i >= n) return;
      const x = X(a.i), y = a.y != null ? Y(a.y) : m.t + 12;
      g += `<line x1="${x}" x2="${x}" y1="${m.t}" y2="${m.t + ih}" style="stroke:var(--ink-3)" stroke-width="1" stroke-dasharray="2 3"/>`;
      const anchor = x > m.l + iw * 0.7 ? "end" : "start";
      g += `<text x="${x + (anchor === "end" ? -6 : 6)}" y="${y}" text-anchor="${anchor}" class="annot">${esc(a.text)}</text>`;
    });

    // interaction layer
    g += `<line class="xhair" x1="0" x2="0" y1="${m.t}" y2="${m.t + ih}" style="stroke:var(--ink-3);display:none" stroke-width="1"/>`;
    g += `<g class="xdots"></g>`;
    g += `<rect class="hit" x="${m.l}" y="${m.t}" width="${iw}" height="${ih}" fill="transparent"/>`;

    const label = esc(s.title ? `${s.title}. ${s.desc || ""}` : s.desc || "Chart");
    this.plot.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${label}" tabindex="0" aria-describedby="${this.id}-hint">${g}</svg>
      <p id="${this.id}-hint" class="visually-hidden">Use the left and right arrow keys to read values. A full data table follows the chart.</p>
      <div class="chart-tip" hidden></div>`;
    this.geo = { X, Y, m, iw, ih, n, band, isBars, drawn };

    // legend (>= 2 series)
    const legendItems = s.series.filter((se) => !se.noLegend);
    this.legend.innerHTML = legendItems.length >= 2
      ? legendItems.map((se) => `<span><i class="swatch" style="background:var(${se.color || "--series-1"});${se.dashed ? "background:repeating-linear-gradient(90deg,var(" + se.color + ") 0 4px,transparent 4px 7px)" : ""}"></i>${esc(se.name)}</span>`).join("")
      : "";
    this.legend.hidden = legendItems.length < 2;

    // table
    const cols = s.series.filter((se) => !se.noTable);
    const tfmt = s.tableFmt || yfmt;
    this.tableWrap.innerHTML = `<table><caption>${esc(s.title || "Chart data")}</caption><thead><tr><th scope="col">${esc(s.x.label || "")}</th>${cols.map((c) => `<th scope="col" class="r">${esc(c.name)}</th>`).join("")}</tr></thead><tbody>` +
      xs.map((x, i) => (s.tableEvery && i % s.tableEvery !== 0 && i !== n - 1) ? "" : `<tr><th scope="row">${esc(xfmt(x, i))}</th>${cols.map((c) => `<td class="r">${c.values[i] == null ? "n/a" : esc(tfmt(c.values[i]))}</td>`).join("")}</tr>`).join("") +
      `</tbody></table>`;

    this.bind();
  };

  Chart.prototype.bind = function () {
    const svg = this.plot.querySelector("svg"), tip = this.plot.querySelector(".chart-tip");
    const xh = svg.querySelector(".xhair"), dots = svg.querySelector(".xdots");
    const { X, Y, m, iw, n, isBars, band, drawn } = this.geo;
    const s = this.spec, yfmt = s.tipFmt || s.y.fmt || String, xfmt = s.x.fmt || String;
    const setIdx = (i) => {
      if (i == null) { xh.style.display = "none"; dots.innerHTML = ""; tip.hidden = true; this.idx = null; return; }
      i = Math.max(0, Math.min(n - 1, i)); this.idx = i;
      const x = X(i);
      xh.setAttribute("x1", x); xh.setAttribute("x2", x); xh.style.display = isBars ? "none" : "";
      dots.innerHTML = isBars ? "" : drawn.filter((d) => d.hi[i] != null).map((d) => `<circle cx="${x}" cy="${Y(d.hi[i])}" r="4.5" style="fill:var(${d.se.color || "--series-1"});stroke:var(--surface)" stroke-width="2"/>`).join("");
      const title = s.tipTitle ? s.tipTitle(s.x.values[i], i) : xfmt(s.x.values[i], i);
      const rows = s.series.filter((se) => !se.hidden && se.values[i] != null).map((se) => `<div class="row"><span><i class="swatch" style="background:var(${se.color || "--series-1"})"></i>${esc(se.name)}</span><span>${esc(yfmt(se.values[i]))}</span></div>`).join("");
      const extra = s.tipExtra ? s.tipExtra(i) : "";
      tip.innerHTML = `<b>${esc(title)}</b>${rows}${extra}`;
      tip.hidden = false;
      const scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
      const px = x * scale, pw = tip.offsetWidth, W = this.plot.clientWidth;
      let left = px + 12; if (left + pw > W) left = px - pw - 12; if (left < 0) left = 0;
      tip.style.left = `${left}px`; tip.style.top = `${m.t * scale}px`;
    };
    const idxFromEvent = (e) => {
      const r = svg.getBoundingClientRect(); const scale = r.width / svg.viewBox.baseVal.width;
      const x = (e.clientX - r.left) / scale;
      if (x < m.l - 4 || x > m.l + iw + 4) return null;
      return isBars ? Math.floor((x - m.l) / band) : Math.round(((x - m.l) / iw) * (n - 1));
    };
    svg.addEventListener("pointermove", (e) => setIdx(idxFromEvent(e)));
    svg.addEventListener("pointerdown", (e) => setIdx(idxFromEvent(e)));
    svg.addEventListener("pointerleave", () => setIdx(null));
    svg.addEventListener("blur", () => setIdx(null));
    svg.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const d = e.key === "ArrowRight" ? 1 : -1;
        setIdx(this.idx == null ? (d > 0 ? 0 : n - 1) : this.idx + d);
      } else if (e.key === "Home") { e.preventDefault(); setIdx(0); }
      else if (e.key === "End") { e.preventDefault(); setIdx(n - 1); }
      else if (e.key === "Escape") setIdx(null);
    });
  };

  FA.chart = (el, spec) => new Chart(el, spec);
})();
