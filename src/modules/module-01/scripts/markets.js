/* Module 1 market-mechanics engine. Pure functions; no DOM. */
(function (root) {
  "use strict";
  const M = {};

  M.spread = (bid, ask) => ({
    amount: ask - bid,
    midpoint: (ask + bid) / 2,
    pct: ask > 0 && bid > 0 ? (ask - bid) / ((ask + bid) / 2) : NaN,
  });

  M.walkBook = (levels, quantity) => {
    let remaining = Math.max(0, quantity), value = 0, filled = 0, worst = null;
    const fills = [];
    for (const level of levels) {
      if (!remaining) break;
      const take = Math.min(remaining, Math.max(0, level.qty));
      if (!take) continue;
      fills.push({ price: level.price, qty: take });
      value += take * level.price;
      filled += take;
      remaining -= take;
      worst = level.price;
    }
    return { requested: quantity, filled, unfilled: remaining, value, average: filled ? value / filled : NaN, worst, fills };
  };

  M.marketCap = (price, shares) => price * shares;
  M.freeFloatCap = (price, shares, freeFloat) => price * shares * freeFloat;
  M.indexWeights = (rows, method = "freeFloat") => {
    const values = rows.map((row) => method === "equal" ? 1 : method === "full"
      ? M.marketCap(row.price, row.shares)
      : M.freeFloatCap(row.price, row.shares, row.freeFloat));
    const total = values.reduce((sum, value) => sum + value, 0);
    return rows.map((row, index) => ({ ...row, value: values[index], weight: total ? values[index] / total : 0 }));
  };

  M.split = (shares, price, numerator, denominator = 1) => {
    const factor = numerator / denominator;
    return { shares: shares * factor, price: price / factor, value: shares * price };
  };
  M.bonus = (shares, price, bonus, held = 1) => M.split(shares, price, held + bonus, held);
  M.rightsTERP = (price, rightsPrice, newShares, heldShares) =>
    (price * heldShares + rightsPrice * newShares) / (heldShares + newShares);
  M.dividendAdjustedPrice = (price, dividend) => Math.max(0, price - dividend);
  M.priceReturn = (start, end) => end / start - 1;
  M.totalReturn = (start, end, cash = 0) => (end + cash) / start - 1;

  M.orderOutcome = ({ type, side = "buy", quote, limit, stop, traded }) => {
    const crosses = side === "buy" ? (p) => quote <= p : (p) => quote >= p;
    if (type === "market") return { active: true, executable: true, priceGuaranteed: false, note: "Seeks an immediate fill at available prices." };
    if (type === "limit") return { active: true, executable: crosses(limit), priceGuaranteed: true, note: crosses(limit) ? "The limit can trade now." : "The order waits because the limit does not cross the quote." };
    const triggered = side === "buy" ? traded >= stop : traded <= stop;
    if (type === "stop") return { active: triggered, executable: triggered, priceGuaranteed: false, note: triggered ? "The stop has become a market order." : "The stop has not triggered." };
    return { active: triggered, executable: triggered && crosses(limit), priceGuaranteed: true, note: !triggered ? "The stop has not triggered." : crosses(limit) ? "Triggered and executable within the limit." : "Triggered, but the limit prevents a fill." };
  };

  root.MARKETS = M;
})(window);
