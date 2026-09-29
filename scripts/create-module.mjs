#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [moduleId, ...titleParts] = process.argv.slice(2);
const title = titleParts.join(" ").trim();

if (!/^module-\d{2}$/.test(moduleId || "") || !title) {
  console.error('Usage: npm run module:new -- module-01 "How Financial Markets Work"');
  process.exit(1);
}

const moduleNumber = String(Number(moduleId.slice(-2)));
const moduleRoot = path.join(ROOT, "src", "modules", moduleId);
if (fs.existsSync(moduleRoot)) {
  console.error(`${moduleId} already exists; no files were changed.`);
  process.exit(1);
}

for (const directory of ["content/lessons", "styles", "scripts"]) {
  fs.mkdirSync(path.join(moduleRoot, directory), { recursive: true });
}

const config = {
  schemaVersion: 1,
  id: moduleId,
  number: moduleNumber,
  label: `Module ${moduleNumber}`,
  title,
  shortTitle: title,
  homeHash: `m${moduleNumber}`,
  lessonCount: 1,
  head: "content/head.html",
  navigation: "content/navigation.html",
  lessonDirectory: "content/lessons",
  styles: ["styles/module.css"],
  scripts: []
};

fs.writeFileSync(path.join(moduleRoot, "module.json"), `${JSON.stringify(config, null, 2)}\n`);
fs.writeFileSync(path.join(moduleRoot, "content", "head.html"),
  `<title>${title}</title>\n<meta name="description" content="Module ${moduleNumber} of Finance Academy: ${title}.">\n`);
fs.writeFileSync(path.join(moduleRoot, "content", "navigation.html"),
  `  <nav class="rail" id="rail" aria-label="Module ${moduleNumber} lessons">\n` +
  `    <p class="rail-module">${title}<span>Module ${moduleNumber}</span></p>\n` +
  `    <ol><li><a href="#m${moduleNumber}"><span class="rail-no">${moduleNumber}</span><span>Module overview</span><svg class="icon rail-status" hidden role="img" aria-label="Complete"><use href="#i-check-circle"></use></svg></a></li></ol>\n` +
  `  </nav>\n`);
fs.writeFileSync(path.join(moduleRoot, "content", "lessons", "00-overview.html"),
  `<article class="lesson" id="m${moduleNumber}" data-lesson data-title="Module ${moduleNumber} overview" data-nav-title="Module overview">\n` +
  `  <header class="lesson-head"><p class="eyebrow">Module ${moduleNumber}</p><h1>${title}</h1>\n` +
  `    <p class="lead">Replace this with the module's one-sentence purpose from the audited architecture.</p></header>\n` +
  `  <section aria-labelledby="m${moduleNumber}-big-idea"><h2 id="m${moduleNumber}-big-idea">The big idea</h2>\n` +
  `    <p>Build the content map before implementing this module. Follow the source-of-truth documents and shared component contracts.</p></section>\n` +
  `</article>\n`);
fs.writeFileSync(path.join(moduleRoot, "styles", "module.css"),
  `/* Module ${moduleNumber}-specific diagrams and layouts only. Shared UI belongs in src/shared/styles/. */\n`);

const docsRoot = path.join(ROOT, "docs", "modules", moduleId);
fs.mkdirSync(docsRoot, { recursive: true });
fs.writeFileSync(path.join(docsRoot, "README.md"),
  `# Module ${moduleNumber}: ${title}\n\nStatus: scaffolded, not architected or released.\n\nAdd the audited module architecture, research register and release record here.\n`);

console.log(`Created ${moduleId}. Next: complete its architecture in docs/modules/${moduleId}/ before adding lessons.`);

