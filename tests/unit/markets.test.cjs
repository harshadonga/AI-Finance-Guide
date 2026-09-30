const fs = require("fs");
const vm = require("vm");
const path = require("path");
const source = fs.readFileSync(path.resolve(__dirname, "../../src/modules/module-01/scripts/markets.js"), "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox);
const M = sandbox.window.MARKETS;
let pass = 0, fail = 0;
function near(name, actual, expected, tolerance = 1e-9) {
  if (Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance) pass++;
  else { fail++; console.error(`FAIL ${name}: got ${actual}, expected ${expected}`); }
}
near("spread", M.spread(99, 101).amount, 2);
near("spread percent", M.spread(99, 101).pct, 0.02);
const fill = M.walkBook([{ price: 100, qty: 50 }, { price: 101, qty: 100 }], 120);
near("filled", fill.filled, 120);
near("average fill", fill.average, (50 * 100 + 70 * 101) / 120);
near("unfilled", fill.unfilled, 0);
near("market cap", M.marketCap(50, 2e7), 1e9);
near("float cap", M.freeFloatCap(50, 2e7, 0.4), 4e8);
const weights = M.indexWeights([{ price: 10, shares: 100, freeFloat: 0.5 }, { price: 20, shares: 100, freeFloat: 1 }]);
near("weight 1", weights[0].weight, 0.2);
near("weight 2", weights[1].weight, 0.8);
const split = M.split(100, 600, 2, 1);
near("split shares", split.shares, 200);
near("split price", split.price, 300);
near("split value", split.value, 60000);
near("TERP", M.rightsTERP(120, 80, 1, 4), 112);
near("price return", M.priceReturn(100, 110), 0.1);
near("total return", M.totalReturn(100, 106, 4), 0.1);
if (!M.orderOutcome({ type: "stop-limit", side: "sell", quote: 96, limit: 95, stop: 97, traded: 96 }).executable) fail++; else pass++;
console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
