/* Module 1 teaching interactions. */
(function () {
  "use strict";
  const { $, $$, fmt } = FA;
  const M = window.MARKETS;
  const LABS = {};
  const set = (root, id, value) => { const el = $("#" + id, root); if (el) el.innerHTML = value; };
  const price = (value) => `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  LABS.tradeTrace = function (root) {
    const steps = [
      ["1", "Order submitted", "Meera sends a buy order through her registered broker. No trade exists yet."],
      ["2", "Order routed", "The broker validates the order and sends it to the exchange."],
      ["3", "Order matched", "The exchange matches compatible buy and sell orders. A trade now exists."],
      ["4", "Obligations cleared", "The clearing corporation calculates what each clearing member must deliver or receive."],
      ["5", "Funds and securities settled", "Funds move through clearing banks and securities move through the depositories."],
      ["6", "Holding recorded", "The purchased shares appear in Meera's demat account through her depository participant."],
    ];
    let index = 0;
    const render = () => {
      set(root, "trace-step", `${steps[index][0]} of ${steps.length}`);
      set(root, "trace-title", steps[index][1]);
      set(root, "trace-copy", steps[index][2]);
      $$(".trace-node", root).forEach((node, i) => {
        node.classList.toggle("is-current", i === index);
        node.classList.toggle("is-done", i < index);
        node.setAttribute("aria-current", i === index ? "step" : "false");
      });
      $("[data-prev-step]", root).disabled = index === 0;
      $("[data-next-step]", root).disabled = index === steps.length - 1;
    };
    $("[data-prev-step]", root).addEventListener("click", () => { index = Math.max(0, index - 1); render(); });
    $("[data-next-step]", root).addEventListener("click", () => { index = Math.min(steps.length - 1, index + 1); render(); });
    $$(".trace-node", root).forEach((node, i) => node.addEventListener("click", () => { index = i; render(); }));
    render();
  };

  LABS.orderChoice = function (root) {
    const type = $("#oc-type", root), side = $("#oc-side", root), quote = $("#oc-quote", root), limit = $("#oc-limit", root), stop = $("#oc-stop", root), traded = $("#oc-traded", root);
    const draw = () => {
      const out = M.orderOutcome({ type: type.value, side: side.value, quote: +quote.value, limit: +limit.value, stop: +stop.value, traded: +traded.value });
      set(root, "oc-state", out.active ? (out.executable ? "Executable now" : "Active, waiting") : "Not triggered");
      set(root, "oc-price", out.priceGuaranteed ? "Limit applies" : "No price guarantee");
      set(root, "oc-insight", `<b>${out.note}</b> An order can control price or urgency, but no order type guarantees both a fill and a particular price.`);
      [quote, limit, stop, traded].forEach((el) => { const o = $("#" + el.id + "-o", root); if (o) o.textContent = fmt.inr(+el.value); });
    };
    [type, side].forEach((el) => el.addEventListener("change", draw));
    [quote, limit, stop, traded].forEach((el) => el.addEventListener("input", draw));
    draw();
  };

  LABS.orderBook = function (root) {
    const asks = [{ price: 100.10, qty: 50 }, { price: 100.20, qty: 90 }, { price: 100.40, qty: 160 }, { price: 100.80, qty: 300 }];
    const bids = [{ price: 99.90, qty: 60 }, { price: 99.80, qty: 100 }, { price: 99.60, qty: 180 }, { price: 99.20, qty: 320 }];
    const qty = $("#ob-qty", root), sideButtons = $$("[data-book-side]", root);
    let side = "buy";
    const renderBook = () => {
      const rows = [...asks].reverse().map((l) => `<tr class="ask"><td>Ask</td><td>${price(l.price)}</td><td>${l.qty}</td></tr>`)
        .concat(bids.map((l) => `<tr class="bid"><td>Bid</td><td>${price(l.price)}</td><td>${l.qty}</td></tr>`)).join("");
      $("#book-levels", root).innerHTML = rows;
    };
    const draw = () => {
      const n = +qty.value;
      $("#ob-qty-o", root).textContent = `${n} shares`;
      const levels = side === "buy" ? asks : bids;
      const result = M.walkBook(levels, n);
      const best = levels[0].price;
      const impact = Number.isFinite(result.average) ? Math.abs(result.average / best - 1) : 0;
      set(root, "ob-avg", Number.isFinite(result.average) ? price(result.average) : "No fill");
      set(root, "ob-fill", `${result.filled} of ${result.requested}`);
      set(root, "ob-impact", fmt.pct(impact, 2));
      set(root, "ob-insight", result.unfilled
        ? `The visible book fills <b>${result.filled}</b> shares and leaves <b>${result.unfilled}</b> unfilled. Displayed depth is finite.`
        : `The ${side} order walks ${result.fills.length} price level${result.fills.length === 1 ? "" : "s"}. The average fill is <b>${price(result.average)}</b>, not the best displayed price of ${price(best)}.`);
    };
    qty.addEventListener("input", draw);
    sideButtons.forEach((button) => button.addEventListener("click", () => {
      side = button.dataset.bookSide;
      sideButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      draw();
    }));
    renderBook(); draw();
  };

  LABS.indexBuilder = function (root) {
    const method = $("#ix-method", root);
    const inputs = $$("input[type=range]", root);
    const chart = FA.chart($("#ix-chart", root), {
      title: "Index weights", desc: "Weights of three hypothetical companies under the selected index method.",
      series: [{ name: "Weight", color: "--series-1", kind: "columns", values: [] }],
      x: { values: ["Aster", "Banyan", "Cobalt"], label: "Hypothetical company" },
      y: { fmt: (v) => `${Math.round(v * 100)}%`, min: 0, max: 1 }, tipFmt: (v) => fmt.pct(v), tableFmt: (v) => fmt.pct(v),
    });
    const draw = () => {
      const rows = [
        { name: "Aster", price: +$("#ix-a-price", root).value, shares: 10e7, freeFloat: +$("#ix-a-float", root).value / 100 },
        { name: "Banyan", price: +$("#ix-b-price", root).value, shares: 8e7, freeFloat: +$("#ix-b-float", root).value / 100 },
        { name: "Cobalt", price: +$("#ix-c-price", root).value, shares: 5e7, freeFloat: +$("#ix-c-float", root).value / 100 },
      ];
      inputs.forEach((input) => { const out = $("#" + input.id + "-o", root); if (out) out.textContent = input.id.includes("float") ? `${input.value}%` : fmt.inr(+input.value); });
      const result = M.indexWeights(rows, method.value);
      chart.update({ x: { values: result.map((r) => r.name), label: "Hypothetical company" }, series: [{ name: "Weight", color: "--series-1", kind: "columns", values: result.map((r) => r.weight) }], y: { fmt: (v) => `${Math.round(v * 100)}%`, min: 0, max: 1 } });
      const largest = result.reduce((a, b) => a.weight > b.weight ? a : b);
      set(root, "ix-insight", `<b>${largest.name}</b> has the largest weight at <b>${fmt.pct(largest.weight)}</b>. Changing the methodology changes whose price move matters most, even though the companies are unchanged.`);
    };
    method.addEventListener("change", draw); inputs.forEach((input) => input.addEventListener("input", draw)); draw();
  };

  LABS.corporateAction = function (root) {
    const action = $("#ca-action", root), price = $("#ca-price", root), shares = $("#ca-shares", root), ratio = $("#ca-ratio", root);
    const draw = () => {
      const p = +price.value, s = +shares.value, r = +ratio.value;
      $("#ca-price-o", root).textContent = fmt.inr(p); $("#ca-shares-o", root).textContent = `${s} shares`; $("#ca-ratio-o", root).textContent = action.value === "dividend" ? fmt.inr(r) : `${r}:1`;
      let newP = p, newS = s, cash = 0, label = "No mechanical value change";
      if (action.value === "split") { const x = M.split(s, p, r); newP = x.price; newS = x.shares; }
      if (action.value === "bonus") { const x = M.bonus(s, p, r, 1); newP = x.price; newS = x.shares; }
      if (action.value === "dividend") { newP = M.dividendAdjustedPrice(p, r); cash = s * r; label = "Price return differs from total return"; }
      set(root, "ca-before", `${s} × ${fmt.inr(p)} = ${fmt.inr(s * p)}`);
      set(root, "ca-after", `${fmt.num(newS)} × ${fmt.inr(newP)}${cash ? ` + ${fmt.inr(cash)} cash` : ""} = ${fmt.inr(newS * newP + cash)}`);
      set(root, "ca-insight", `<b>${label}.</b> The action changes units or moves value between price and cash. It does not create wealth by arithmetic alone.`);
    };
    action.addEventListener("change", draw); [price, shares, ratio].forEach((input) => input.addEventListener("input", draw)); draw();
  };

  FA.labs = LABS;
  function initIn(el) {
    $$("[data-lab]", el).forEach((node) => {
      if (node.dataset.labReady) return;
      const fn = LABS[node.dataset.lab];
      if (!fn) { console.warn("No lab:", node.dataset.lab); return; }
      node.dataset.labReady = "1";
      try { fn(node); } catch (error) { console.error("Lab failed:", node.dataset.lab, error); node.insertAdjacentHTML("beforeend", '<p class="source-note">This explorer could not start. The worked example above covers the same relationship.</p>'); }
    });
  }
  document.addEventListener("fa:lesson", (event) => initIn(event.detail.el));
})();
