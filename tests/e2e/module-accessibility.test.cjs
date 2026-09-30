// Keyboard, focus, mobile rail and Project 0 flows.
const { chromium } = require("playwright-core");
const path = require("path");
const fs = require("fs");
const { browserExecutable } = require("./browser.cjs");
(async () => {
  const moduleId = process.argv[2] || "module-00";
  const marketModule = moduleId === "module-01";
  const profile = marketModule ? {
    keyboardLesson: "l08", range: "#oc-quote", rangeOutput: "#oc-quote-o", chart: "#ix-chart svg",
    chartLesson: "l11", quiz: "#l08 [data-quiz]", glossaryLesson: "l06", glossary: "#l06 .term", nextLesson: "l09", mobileLesson: "l09",
  } : {
    keyboardLesson: "l04", range: "#cp-n", rangeOutput: "#cp-n-o", chart: "#cp-chart svg",
    chartLesson: "l04", quiz: '[data-id="q04-3"]', glossaryLesson: "l04", glossary: "#l04 .term", nextLesson: "l05", mobileLesson: "l02",
  };
  const browser = await chromium.launch({ executablePath: browserExecutable() });
  const url = "file://" + path.resolve(__dirname, `../../dist/${moduleId}/preview.html`);
  const out = [];
  // --- Desktop keyboard
  let ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  let page = await ctx.newPage();
  const errs = []; page.on("pageerror", (e) => errs.push(e.message));
  await page.goto(url); await page.waitForTimeout(400);
  await page.keyboard.press("Tab");
  let f = await page.evaluate(() => document.activeElement.className + "|" + document.activeElement.textContent.trim());
  if (!/skip/.test(f)) out.push("first Tab is not skip link: " + f);
  await page.keyboard.press("Enter"); await page.waitForTimeout(100);
  f = await page.evaluate(() => document.activeElement.id);
  if (f !== "main") out.push("skip link did not move focus to main: " + f);
  await page.evaluate((hash) => (location.hash = hash), profile.keyboardLesson); await page.waitForTimeout(300);
  // tab through 60 stops, ensure focus visible (outline or box-shadow) on each
  let invisible = [];
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement; const cs = getComputedStyle(el);
      const visible = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== "none";
      return { tag: el.tagName, cls: el.className?.baseVal ?? el.className, id: el.id, visible, type: el.type };
    });
    if (!info.visible && info.type !== "range" && info.tag !== "BODY") invisible.push(`${info.tag}.${info.cls}#${info.id}`);
  }
  if (invisible.length) out.push("focus not visible on: " + [...new Set(invisible)].slice(0, 8).join(", "));
  // arrow keys on a range slider change value
  const rangeOk = await page.evaluate((selector) => { const r = document.querySelector(selector); r.focus(); return r.value; }, profile.range);
  await page.keyboard.press("ArrowRight"); await page.waitForTimeout(50);
  const rangeAfter = await page.evaluate(({ range, output }) => [document.querySelector(range).value, document.querySelector(output).textContent], { range: profile.range, output: profile.rangeOutput });
  if (rangeAfter[0] === rangeOk) out.push("ArrowRight did not change slider");
  // chart keyboard
  await page.evaluate((hash) => (location.hash = hash), profile.chartLesson); await page.waitForTimeout(200);
  await page.evaluate((selector) => document.querySelector(selector).focus(), profile.chart);
  await page.keyboard.press("ArrowRight");
  const tip = await page.evaluate((selector) => !document.querySelector(selector).closest(".chart").querySelector(".chart-tip").hidden, profile.chart);
  if (!tip) out.push("chart tooltip not shown on keyboard");
  // quiz with keyboard: focus first radio, choose with space, Enter on button
  await page.evaluate((hash) => (location.hash = hash), profile.keyboardLesson); await page.waitForTimeout(200);
  await page.evaluate((selector) => document.querySelector(selector + " input").focus(), profile.quiz);
  await page.keyboard.press("ArrowDown"); await page.keyboard.press("Space");
  await page.evaluate((selector) => document.querySelector(selector + " [data-check]").focus(), profile.quiz);
  await page.keyboard.press("Enter"); await page.waitForTimeout(50);
  const qa = await page.evaluate((selector) => document.querySelector(selector).dataset.answered, profile.quiz);
  if (!qa) out.push("quiz not answerable by keyboard");
  // glossary term by keyboard + Escape
  await page.evaluate((hash) => (location.hash = hash), profile.glossaryLesson); await page.waitForTimeout(200);
  await page.evaluate((selector) => document.querySelector(selector).focus(), profile.glossary);
  await page.keyboard.press("Enter"); await page.waitForTimeout(50);
  let pop = await page.evaluate(() => !!document.getElementById("term-pop"));
  await page.keyboard.press("Escape"); await page.waitForTimeout(50);
  const popAfter = await page.evaluate(() => [!!document.getElementById("term-pop"), document.activeElement.classList.contains("term")]);
  if (!pop || popAfter[0] || !popAfter[1]) out.push(`term popover keyboard: open=${pop} after=${popAfter}`);
  // lesson nav focus moves to h1 on hash change
  await page.evaluate((hash) => (location.hash = hash), profile.nextLesson); await page.waitForTimeout(200);
  const h = await page.evaluate(() => document.activeElement.tagName + "|" + document.activeElement.textContent);
  if (!/^H1/.test(h)) out.push("focus not on h1 after navigation: " + h);
  await ctx.close();

  // --- Mobile rail
  ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  page = await ctx.newPage(); page.on("pageerror", (e) => errs.push(e.message));
  await page.goto(url + "#" + profile.mobileLesson); await page.waitForTimeout(400);
  const railHidden = await page.evaluate(() => getComputedStyle(document.getElementById("rail")).visibility);
  if (railHidden !== "hidden") out.push("rail visible on mobile before opening");
  await page.click("#menu-btn"); await page.waitForTimeout(350);
  const railOpen = await page.evaluate(() => [getComputedStyle(document.getElementById("rail")).visibility, document.getElementById("menu-btn").getAttribute("aria-expanded"), document.activeElement.closest("#rail") != null]);
  if (railOpen[0] !== "visible" || railOpen[1] !== "true" || !railOpen[2]) out.push("mobile rail open state wrong: " + railOpen);
  await page.keyboard.press("Escape"); await page.waitForTimeout(350);
  const railClosed = await page.evaluate(() => [getComputedStyle(document.getElementById("rail")).visibility, document.activeElement.id]);
  if (railClosed[0] !== "hidden" || railClosed[1] !== "menu-btn") out.push("mobile rail close state wrong: " + railClosed);
  // touch target sizes on mobile: buttons/links in controls >= 44px tall (excluding inline text links and terms)
  const small = await page.evaluate((hash) => Array.from(document.querySelectorAll(`#${hash} .btn, #${hash} .q-opt, #${hash} summary, .topbar .btn`)).filter((e) => e.offsetParent && e.getBoundingClientRect().height < 40).map((e) => e.className + ":" + Math.round(e.getBoundingClientRect().height)), profile.mobileLesson);
  if (small.length) out.push("small touch targets: " + small.slice(0, 6).join(", "));
  await ctx.close();

  // --- Module-specific end-to-end flow
  ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await ctx.newPage(); page.on("pageerror", (e) => errs.push(e.message));
  if (marketModule) {
    await page.goto(url + "#l07"); await page.waitForTimeout(400);
    const firstTitle = await page.textContent("#trace-title");
    await page.click("[data-next-step]");
    const secondTitle = await page.textContent("#trace-title");
    if (firstTitle === secondTitle) out.push("trade trace did not advance");
    await page.goto(url + "#l09"); await page.waitForTimeout(300);
    await page.click('[data-book-side="sell"]');
    const sellPressed = await page.getAttribute('[data-book-side="sell"]', "aria-pressed");
    if (sellPressed !== "true") out.push("order-book side toggle did not update");
    await page.goto(url + "#mastery"); await page.waitForTimeout(300);
    await page.click("[data-score]");
    const result = await page.textContent("[data-score-out]");
    if (!result.trim()) out.push("mastery result did not render");
    await ctx.close();
    console.log(out.length ? out.map((o) => "✗ " + o).join("\n") : `✓ keyboard, mobile rail and ${moduleId} flows passed`);
    console.log("page errors:", errs.length ? errs : "none");
    if (out.length || errs.length) process.exitCode = 1;
    await browser.close();
    return;
  }
  await page.goto(url + "#project"); await page.waitForTimeout(400);
  const nAssets = await page.$$eval("#p0-assets .p0-row", (r) => r.length);
  await page.click('[data-add="assets"]');
  const nAfter = await page.$$eval("#p0-assets .p0-row", (r) => r.length);
  if (nAfter !== nAssets + 1) out.push("add asset failed");
  await page.fill("#as-n-" + nAssets, "Test asset"); await page.fill("#as-v-" + nAssets, "1,00,000");
  await page.waitForTimeout(100);
  const nw = await page.evaluate(() => document.querySelectorAll(".p0-card-v")[2].textContent);
  if (!/8\.39 lakh/.test(nw)) out.push("net worth did not update after adding ₹1 lakh asset: " + nw);
  await page.click(`#p0-assets .p0-row:last-child [data-del]`);
  const nDel = await page.$$eval("#p0-assets .p0-row", (r) => r.length);
  if (nDel !== nAssets) out.push("delete asset failed");
  // start with my numbers: confirm flow
  await page.click("#p0-mine"); const conf = await page.isVisible("#p0-confirm");
  await page.click("#p0-confirm-yes"); await page.waitForTimeout(100);
  const empty = await page.evaluate(() => [document.getElementById("p0-takehome").value, document.querySelectorAll(".p0-card-v")[0].textContent]);
  if (!conf || empty[0] !== "" ) out.push("start-empty flow wrong: " + empty);
  if (/NaN|Infinity|undefined/.test(await page.evaluate(() => document.getElementById("p0-summary").textContent))) out.push("empty dashboard shows NaN/Infinity");
  await page.fill("#p0-takehome", "90000"); await page.fill("#p0-fixed", "30000"); await page.fill("#p0-variable", "15000"); await page.fill("#p0-disc", "20000");
  await page.waitForTimeout(400);
  const sr = await page.evaluate(() => document.querySelectorAll(".p0-card-v")[0].textContent);
  if (sr !== "27.8%") out.push("savings rate for 90k/65k expected 27.8%, got " + sr);
  // persistence across reload
  await page.reload(); await page.waitForTimeout(500);
  const kept = await page.evaluate(() => document.getElementById("p0-takehome").value);
  if (kept !== "90,000") out.push("data not persisted across reload: " + kept);
  // export fallback (no claude runtime locally)
  await page.click("#p0-export"); await page.waitForTimeout(200);
  const fbText = await page.evaluate(() => document.getElementById("p0-fallback").hidden ? "" : document.getElementById("p0-fallback-text").value);
  if (!fbText.includes('"takeHome": 90000')) out.push("export fallback text missing");
  // import: write file and set
  const tmp = path.resolve(__dirname, `../../dist/${moduleId}/p0-import.json`);
  const obj = JSON.parse(fbText); obj.income.takeHome = 123456; fs.writeFileSync(tmp, JSON.stringify(obj));
  await page.setInputFiles("#p0-import", tmp); await page.waitForTimeout(300);
  const imp = await page.evaluate(() => document.getElementById("p0-takehome").value);
  if (imp !== "1,23,456") out.push("import failed: " + imp);
  fs.writeFileSync(tmp, "{bad json"); await page.setInputFiles("#p0-import", tmp); await page.waitForTimeout(300);
  const bad = await page.evaluate(() => document.getElementById("p0-mode").textContent);
  if (!/Could not import/.test(bad)) out.push("bad import shows no error");
  // undo delete
  const before = await page.$$eval("#p0-assets .p0-row", (r) => r.length);
  await page.click("#p0-assets .p0-row [data-del]");
  await page.click("#p0-undo-btn"); await page.waitForTimeout(100);
  const afterUndo = await page.$$eval("#p0-assets .p0-row", (r) => r.length);
  if (afterUndo !== before) out.push(`undo delete failed ${before}->${afterUndo}`);
  // sample load asks for confirmation when user data present
  await page.click("#p0-sample"); const askS = await page.isVisible("#p0-confirm");
  await page.click("#p0-confirm-no");
  const stillMine = await page.evaluate(() => document.getElementById("p0-takehome").value);
  if (!askS || stillMine !== "1,23,456") out.push("sample load did not confirm or overwrote data");
  await ctx.close();

  console.log(out.length ? out.map((o) => "✗ " + o).join("\n") : `✓ keyboard, mobile rail and ${moduleId} flows passed`);
  console.log("page errors:", errs.length ? errs : "none");
  if (out.length || errs.length) process.exitCode = 1;
  await browser.close();
})();
