// Render checks: node scripts/screenshot.cjs [module-id] [hash] [width] [theme] [fullPage]
// Saves screenshots to dist/shots and prints console errors + horizontal overflow.
const { chromium } = require("playwright-core");
const path = require("path");
const { browserExecutable } = require("../tests/e2e/browser.cjs");
(async () => {
  const [moduleId = "module-00", hash = "m0", width = "1280", theme = "light", full = "0", scrollTo = ""] = process.argv.slice(2);
  const browser = await chromium.launch({ executablePath: browserExecutable() });
  const ctx = await browser.newContext({ viewport: { width: +width, height: 900 }, colorScheme: theme, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (["error", "warning"].includes(m.type())) errors.push(`${m.type()}: ${m.text()}`); });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  const file = "file://" + path.resolve(__dirname, `../dist/${moduleId}/preview.html`) + "#" + hash;
  await page.goto(file);
  await page.waitForTimeout(900);
  if (scrollTo) { await page.evaluate((s) => document.querySelector(s)?.scrollIntoView(), scrollTo); await page.waitForTimeout(300); }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const out = path.resolve(__dirname, `../dist/shots/${moduleId}-${hash}-${width}-${theme}${scrollTo ? "-" + scrollTo.replace(/\W/g, "") : ""}.png`);
  require("fs").mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out, fullPage: full === "1" });
  console.log(JSON.stringify({ out, overflow, errors }, null, 1));
  await browser.close();
})();
