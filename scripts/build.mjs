#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const academy = readJson(path.join(ROOT, "academy.config.json"));
const usedIcons = new Set();

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function resolveRoot(relativePath) {
  return path.resolve(ROOT, relativePath);
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function icon(name, className = "icon") {
  usedIcons.add(name);
  return `<svg class="${className}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;
}

function parseAttributes(source) {
  const result = {};
  for (const match of source.matchAll(/(\w[\w-]*)=(?:"([^"]*)"|(\S+))/g)) {
    result[match[1]] = match[2] ?? match[3];
  }
  return result;
}

function parseItems(body) {
  const stem = [];
  const options = [];
  const explanation = [];
  const reveal = [];
  let mode = null;

  for (const raw of body.trim().split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("? ")) {
      stem.push(line.slice(2));
      mode = "stem";
    } else if (line.startsWith("- ") || line.startsWith("+ ")) {
      const [text, why = ""] = line.slice(2).split(" || ", 2);
      options.push({ correct: line[0] === "+", text: text.trim(), why: why.trim() });
      mode = "option";
    } else if (line.startsWith("= ")) {
      explanation.push(line.slice(2));
      mode = "explanation";
    } else if (line.startsWith("> ")) {
      reveal.push(line.slice(2));
      mode = "reveal";
    } else if (mode === "stem") {
      stem.push(line);
    } else if (mode === "explanation") {
      explanation.push(line);
    } else if (mode === "reveal") {
      reveal.push(line);
    } else if (mode === "option" && options.length) {
      options.at(-1).why += ` ${line}`;
    }
  }

  return {
    stem: stem.join(" "),
    options,
    explanation: explanation.join("\n"),
    reveal: reveal.join("\n")
  };
}

function renderChoice(attributes, body, predict, warnings) {
  const id = attributes.id;
  const { stem, options, explanation, reveal } = parseItems(body);
  if (options.filter((option) => option.correct).length !== 1) {
    warnings.push(`${id}: choice needs exactly one correct option`);
  }
  const label = attributes.label || (predict ? "Predict first" : "Knowledge check");
  const component = attributes.comp ? ` data-comp="${attributes.comp}"` : "";
  const optionHtml = options.map((option, index) =>
    `<label class="q-opt"${option.correct ? " data-correct" : ""}><input type="radio" name="${id}" value="${index}">` +
    `<span>${option.text}<span class="q-mark"></span>` +
    (option.why ? `<span class="q-why" hidden>${option.why}</span>` : "") +
    "</span></label>"
  ).join("");
  const button = predict ? "Lock in my prediction" : "Check answer";
  const retry = predict ? "" : '<button type="button" class="btn btn--ghost" data-retry hidden>Try again</button>';
  const revealHtml = reveal ? `<div class="reveal flow" hidden>${reveal}</div>` : "";
  const explanationHtml = explanation ? `<div class="q-explain" hidden>${explanation}</div>` : "";

  return `<div class="block block--${predict ? "predict" : "quiz"}" data-quiz${predict ? " data-predict" : ""} data-id="${id}"${component}>` +
    `<p class="block-label">${icon(predict ? "brain" : "question")} ${label}</p>` +
    `<p class="q-stem" id="${id}-stem">${stem}</p>` +
    `<fieldset class="q-options" aria-labelledby="${id}-stem">${optionHtml}</fieldset>` +
    `<div class="q-actions"><button type="button" class="btn btn--primary" data-check>${button}</button>${retry}</div>` +
    `<div class="q-feedback" aria-live="polite"></div>${explanationHtml}${revealHtml}</div>`;
}

function renderNumeric(attributes, body) {
  const id = attributes.id;
  const { stem, explanation } = parseItems(body);
  const component = attributes.comp ? ` data-comp="${attributes.comp}"` : "";
  return `<div class="block block--quiz" data-quiz="numeric" data-id="${id}" data-answer="${attributes.answer}" ` +
    `data-tol="${attributes.tol || ""}" data-answer-text="${escapeAttribute(attributes.text || attributes.answer)}"${component}>` +
    `<p class="block-label">${icon("calculator")} ${attributes.labeltext || "Calculate"}</p>` +
    `<p class="q-stem">${stem}</p><div class="q-numeric"><div class="field">` +
    `<label for="${id}-in">${attributes.label || "Your answer"}</label>` +
    `<input class="input" id="${id}-in" type="text" inputmode="decimal" autocomplete="off" spellcheck="false"></div>` +
    '<button type="button" class="btn btn--primary" data-check>Check answer</button>' +
    '<button type="button" class="btn btn--ghost" data-retry hidden>Try again</button></div>' +
    '<div class="q-feedback" aria-live="polite"></div>' +
    (explanation ? `<div class="q-explain" hidden>${explanation}</div>` : "") + "</div>";
}

const LADDER_LEVELS = {
  A: "Recognition",
  B: "Calculation",
  C: "Interpretation",
  D: "Application",
  E: "Challenge"
};

function renderLadder(body) {
  const items = [];
  let current = null;
  for (const raw of body.trim().split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const heading = line.match(/^#\s*([A-E])\b\s*(.*)/);
    if (heading) {
      current = { level: heading[1], question: heading[2] ? [heading[2]] : [], answer: [], mode: "question" };
      items.push(current);
    } else if (line.startsWith("A:") && current) {
      current.mode = "answer";
      current.answer.push(line.slice(2).trim());
    } else if (current) {
      current[current.mode].push(line);
    }
  }

  return '<div class="ladder">' + items.map((item) =>
    `<details class="ladder-item"><summary><span class="ladder-level">${item.level}</span>` +
    `<span><span class="ladder-kind">${LADDER_LEVELS[item.level]}</span>${item.question.join(" ")}</span>` +
    '<span class="ladder-show">Show answer</span></summary>' +
    `<div class="ladder-answer">${item.answer.join(" ")}</div></details>`
  ).join("") + "</div>";
}

function expand(source, warnings) {
  return source
    .replace(/<!--quiz(.*?)-->([\s\S]*?)<!--\/quiz-->/g, (_, raw, body) => renderChoice(parseAttributes(raw), body, false, warnings))
    .replace(/<!--predict(.*?)-->([\s\S]*?)<!--\/predict-->/g, (_, raw, body) => renderChoice(parseAttributes(raw), body, true, warnings))
    .replace(/<!--numeric(.*?)-->([\s\S]*?)<!--\/numeric-->/g, (_, raw, body) => renderNumeric(parseAttributes(raw), body))
    .replace(/<!--ladder-->([\s\S]*?)<!--\/ladder-->/g, (_, body) => renderLadder(body))
    .replace(/\{\{i:([\w-]+)\}\}/g, (_, name) => icon(name))
    .replace(/\{\{tag:([^}]+)\}\}/g, (match, value) => {
      const [kind, ...rest] = value.split(":");
      const label = rest.join(":");
      if (kind === "hyp") return `<span class="tag tag--hyp">${icon("flask")}Hypothetical</span>`;
      if (kind === "hist") return `<span class="tag tag--hist">${icon("clock-counter-clockwise")}Historical${label ? `: ${label}` : ""}</span>`;
      if (kind === "curr") return `<span class="tag tag--curr">${icon("seal-check")}Current · verified ${label}</span>`;
      return match;
    })
    .replace(/\[\[([\w-]+)\|([^\]]+)\]\]/g, (_, id, text) => `<button type="button" class="term" data-term="${id}">${text}</button>`);
}

function applyTypography(source) {
  const protectedBlocks = source.split(/(<(?:pre|code|script|style|math|textarea)\b[\s\S]*?<\/(?:pre|code|script|style|math|textarea)>)/gi);
  return protectedBlocks.map((block, blockIndex) => {
    if (blockIndex % 2 === 1) {
      return /^<code\b/i.test(block) ? block.replace(/^<code/i, '<code translate="no"') : block;
    }
    return block.split(/(<[^>]+>)/g).map((piece, pieceIndex) => {
      if (pieceIndex % 2 === 1 || !piece) return piece;
      return piece
        .replace(/(^|[\s(\[{>—–-])"/g, "$1“")
        .replaceAll('"', "”")
        .replace(/(\w)'(\w)/g, "$1’$2")
        .replace(/(^|[\s(])'/g, "$1‘")
        .replaceAll("'", "’")
        .replace(/(\d) (lakh|crore|months?|years?|yr|mo)\b/g, "$1\u00a0$2")
        .replace(/₹ (\d)/g, "₹$1");
    }).join("");
  }).join("");
}

function createSprite(errors) {
  const iconRoot = resolveRoot("node_modules/@phosphor-icons/core/assets/regular");
  const symbols = [];
  for (const name of [...usedIcons].sort()) {
    const file = path.join(iconRoot, `${name}.svg`);
    if (!fs.existsSync(file)) {
      errors.push(`missing icon: ${name}`);
      continue;
    }
    const inner = read(file)
      .replace(/^[\s\S]*?<svg[^>]*>/, "")
      .replace(/<\/svg>\s*$/, "")
      .replace('<rect width="256" height="256" fill="none"/>', "");
    symbols.push(`<symbol id="i-${name}" viewBox="0 0 256 256">${inner}</symbol>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">${symbols.join("")}</svg>`;
}

function replacePlaceholders(template, values) {
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (match, key) => key in values ? values[key] : match);
}

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

function buildModule(moduleId) {
  usedIcons.clear();
  const errors = [];
  const warnings = [];
  const moduleRoot = resolveRoot(path.join(academy.sourceRoot, moduleId));
  const configFile = path.join(moduleRoot, "module.json");
  if (!fs.existsSync(configFile)) throw new Error(`Unknown module: ${moduleId}`);
  const config = readJson(configFile);
  if (config.id !== moduleId) errors.push(`module.json id '${config.id}' does not match directory '${moduleId}'`);

  const lessonRoot = path.join(moduleRoot, config.lessonDirectory);
  const lessonFiles = fs.readdirSync(lessonRoot)
    .filter((name) => name.endsWith(".html"))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  if (!lessonFiles.length) errors.push("module has no lesson files");
  if (config.lessonCount !== lessonFiles.length) {
    errors.push(`module.json lessonCount is ${config.lessonCount}, but ${lessonFiles.length} lesson files were found`);
  }

  const lessons = lessonFiles.map((name) => expand(read(path.join(lessonRoot, name)), warnings)).join("\n");
  const navigation = read(path.join(moduleRoot, config.navigation));
  const shell = replacePlaceholders(read(resolveRoot(academy.shared.template)), {
    MODULE_ID: config.id,
    MODULE_LABEL: config.label,
    MODULE_TITLE: config.title,
    HOME_HASH: config.homeHash,
    LESSON_COUNT: String(config.lessonCount),
    MODULE_NAVIGATION: navigation,
    LESSONS: lessons
  });
  const body = applyTypography(expand(shell, warnings));

  for (const name of ["arrow-left", "arrow-right", "moon", "sun", "circle-half", "check-circle", "x-circle", "check", "x", "list", "magnifying-glass"]) {
    usedIcons.add(name);
  }

  const cssFiles = [...academy.shared.styles.map(resolveRoot), ...config.styles.map((file) => path.join(moduleRoot, file))];
  const scriptFiles = [...academy.shared.scripts.map(resolveRoot), ...config.scripts.map((file) => path.join(moduleRoot, file))];
  const css = cssFiles.map(read).join("\n");
  const script = scriptFiles.map(read).join("\n");
  const head = read(path.join(moduleRoot, config.head));
  const sprite = createSprite(errors);
  const page = `${head}\n<style>\n${css}\n</style>\n${sprite}\n${body}\n<script>\n${script}\nFA.boot();\n</script>\n`;

  if (script.replaceAll("</script>", "").includes("</script")) errors.push("stray </script sequence in bundled JavaScript");
  const ids = [...page.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = duplicateValues(ids);
  if (duplicateIds.length) errors.push(`duplicate ids: ${duplicateIds.slice(0, 20).join(", ")}`);
  const glossary = read(resolveRoot("src/shared/scripts/glossary.js"));
  for (const match of page.matchAll(/data-term="([\w-]+)"/g)) {
    if (!glossary.includes(`"${match[1]}":`)) errors.push(`glossary term missing: ${match[1]}`);
  }
  for (const match of page.matchAll(/<a[^>]*href="#([\w.~-]+)"/g)) {
    if (!ids.includes(match[1])) errors.push(`broken anchor: #${match[1]}`);
  }
  const visiblePage = page.replace(/<script>[\s\S]*?<\/script>/g, "");
  if (visiblePage.includes("—") || visiblePage.includes("–")) warnings.push("visible output contains em/en dash characters");

  const outputRoot = resolveRoot(path.join(academy.outputRoot, moduleId));
  fs.mkdirSync(outputRoot, { recursive: true });
  fs.writeFileSync(path.join(outputRoot, "index.html"), page);
  const fontFiles = [
    "geist/400.css", "geist/500.css", "geist/600.css", "geist/700.css", "geist/800.css", "geist/400-italic.css",
    "geist-mono/400.css", "geist-mono/500.css", "geist-mono/600.css"
  ];  const localFonts = fontFiles.map((font) =>
    `<link rel="stylesheet" href="${pathToFileURL(resolveRoot(`node_modules/@fontsource/${font}`)).href}">`
  ).join("");
  const previewPage = page.replace(/\n?<link[^>]+href="https:\/\/fonts\.(?:googleapis|gstatic)\.com[^"]*"[^>]*>/g, "");
  const preview = '<!doctype html><html lang="en-IN"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
    '<style>:root{padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}[hidden]{display:none!important}</style>' +
    `${localFonts}</head><body>${previewPage}</body></html>`;
  fs.writeFileSync(path.join(outputRoot, "preview.html"), preview);

  console.log(`built ${path.relative(ROOT, path.join(outputRoot, "index.html"))} (${Math.round(Buffer.byteLength(page) / 1024)} KB, ${usedIcons.size} icons, ${lessonFiles.length} lessons)`);
  for (const warning of warnings) console.warn(`WARN ${moduleId}: ${warning}`);
  for (const error of errors) console.error(`ERROR ${moduleId}: ${error}`);
  return errors.length;
}

function discoverModules() {
  const sourceRoot = resolveRoot(academy.sourceRoot);
  return fs.readdirSync(sourceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(sourceRoot, entry.name, "module.json")))
    .map((entry) => entry.name)
    .sort();
}

const requested = process.argv.slice(2);
const modules = !requested.length || requested.includes("--all") ? discoverModules() : requested;
let failures = 0;
for (const moduleId of modules) failures += buildModule(moduleId);
if (failures) process.exitCode = 1;
