# 05 · Component Library

Version 2.0 · Swiss textbook redesign · 29 Sep 2026 (1.0 established with Module 0)
Styles: `src/shared/styles/components.css` · Runtime: `src/shared/scripts/core.js` (router, glossary, checks, notes, formatting) and `src/shared/scripts/charts.js` (charts) · Build: `scripts/build.mjs`

Components implement Teaching Spec §24 (ConceptCard … LessonNavigation). Every module reuses them; new components are added here first, then used.

---

## 1. Source layout and build

```
src/
  shared/      templates/  styles/  scripts/                               ← shared, never forked
  modules/
    module-NN/ module.json  content/  styles/  scripts/                     ← module source
scripts/       build.mjs  create-module.mjs  screenshot.cjs
tests/         unit/  e2e/
dist/          module-NN/index.html  preview.html                           ← generated, ignored
```

`scripts/build.mjs` discovers modules through `module.json`, expands the authoring macros, inlines CSS, JS and the icon sprite into one self-contained page, applies the typography pass (curly quotes, non-breaking spaces before units), and flags duplicate ids, missing glossary terms, missing icons, broken in-page anchors and em or en dashes.

### Authoring macros

| Macro | Produces |
|---|---|
| `{{i:name}}` | Phosphor icon, `aria-hidden` |
| `[[term-id\|text]]` | Glossary term button with popover |
| `{{tag:hyp}}` · `{{tag:hist:Label}}` · `{{tag:curr:Date}}` | Data-category tags (Spec §28) |
| `<!--predict id=…--> ? stem  - option \|\| why  + correct \|\| why  > reveal html <!--/predict-->` | Predict-then-reveal |
| `<!--quiz id=… comp=…--> ? …  - … \|\| …  + … \|\| …  = explanation <!--/quiz-->` | Knowledge check with per-option misconception feedback |
| `<!--numeric id=… answer=… tol=… text=… label=… comp=…--> ? …  = worked solution <!--/numeric-->` | Numeric check |
| `<!--ladder--> # A question  A: answer … # E … <!--/ladder-->` | Practice ladder A–E (Spec §12) |

`comp` is one of Understanding, Calculation, Interpretation, Application and feeds the competency summary (Spec §52).

## 2. Page shell

- **Top bar** (`.topbar`): compact FA monogram and course mark, module crumb, semantic progress bar (`[data-meter][role="progressbar"]`), Glossary button, three-state theme button. Sticky, respects the safe-area inset.
- **Module rail** (`nav.rail`): parts and lessons with syllabus numbers; `aria-current="page"`; a tick appears when a lesson's checks have all been answered. It becomes a drawer below 900px (Escape closes it and focus returns to the menu button).
- **Lesson** (`article.lesson[data-lesson]`): one lesson visible at a time; the URL hash is the lesson id or a section id (`#l04`, `#l04-cagr`). On navigation, focus moves to the lesson's h1.
- **Lesson navigation** (`[data-lesson-nav]`): open, rule-led previous and next links, generated automatically.
- **Skip link**, glossary dialog, toast (`role="status"`).

## 3. Lesson anatomy (order from Teaching Spec §4)

`header.lesson-head` (kicker, h1, big idea, on-page links) → why → intuition → predict → core concepts → explorer → formal model → realistic example → misconceptions → where the model breaks → case → knowledge check → practice ladder → notes. On wide screens the header becomes a two-column chapter plate, with the title and big idea sharing the opening field; it collapses to the same semantic order on mobile. Each block is a `<section id="lNN-slug" aria-labelledby>` with an h2.

The Module 0 overview uses `.overview-opening`: an asymmetric title-and-metadata column beside `.overview-thesis`, a compact stocks/flows/buffers model. This is a teaching diagram with a text alternative, not decorative hero art.

## 4. Information blocks

| Component (Spec §24 name) | Markup | Required content |
|---|---|---|
| IntuitionCard | `aside.block.block--intuition` + `.block-label` | A mental model, mapped back to the mechanics |
| ExampleCard | `div.block.block--example` > `.block-head` (label + data tag) | Real numbers, interpretation |
| FormulaCard | `div.block.block--formula` > `.fx` (MathML) + `dl.vars` + `.fx-meta` | Formula, every variable with units, interpretation, worked example, sensitivity, limitations (Spec §6.6) |
| WarningCard | `div.block.block--caution` | A specific risk |
| MisconceptionCard | `div.block.block--mistake` > `.claim` + "Why this fails" + "Better question" | Spec §9 format |
| Lens | `div.block.block--lens` | Investor, Quant or AI angle |
| AdvancedNote | `details.block.block--advanced` | Layer 3 depth (Spec §7) |
| CaseStudy | `section.case` > `.case-grid` (at the time / afterwards) + `.case-lessons` | Spec §11 and §38 |
| SourceNote | `p.verified` (seal icon, "Verified DATE", sources) · `p.source-note` | Required for every current fact (Spec §30–31) |
| GlossaryTerm | `button.term[data-term]` | Must exist in `glossary.js` |

## 5. Interaction components

**QuizCard** (`[data-quiz]`). Radio options inside `label.q-opt` share one hit target. "Check answer" marks the chosen option and the correct one with an icon and text, and shows the reasoning for the chosen option, including why a wrong answer is tempting (Spec §5.8, §48). With nothing selected, it prompts instead of failing. "Try again" resets. Numeric checks accept ₹, commas and % and use a tolerance. Predictions (`data-predict`) lock after one answer and reveal the explanation; they are not scored.

**Assessment** (`[data-assessment]` with `data-revisit-<competency>` lesson lists) summarises checks by competency: Secure ≥ 80%, Developing 50–79%, Revisit < 50%. It recommends and never blocks (Spec §49).

**Explorer / "lab bench"** (`section.bench[data-lab="name"]`). The bench uses a stronger neutral ground and an inset ink rule so interactive work is structurally distinct without becoming another card. Structure: `.bench-head` (label, title, a one-line purpose that states what the learner should notice, data tag) → `.bench-body` (`.bench-controls` | `.bench-output`: `.readouts`, chart, `.insight` with `aria-live`) → optional `.bench-foot` "Try this". Contract for `LABS.name(root)`:
1. controls are labelled `<input type=range>` with an `<output>` showing a formatted value, or selects, checkboxes and `.seg` toggle groups with `aria-pressed`;
2. every number comes from the module's tested engine (`finance.js`), never from ad-hoc arithmetic in the lab;
3. readouts must never show NaN, Infinity or undefined (the QA script sweeps every control to its minimum and maximum);
4. the insight sentence changes with the state and tells the learner what the numbers mean;
5. labs start when their lesson is first shown, so charts measure a visible container.

**InteractiveChart** (`FA.chart(el, spec)` → `.update(spec)`). Types: line, area, stacked area, columns (stacked or grouped), reference line, annotations, end labels, bar labels. The spec includes `title`, `desc` (a text description used as the SVG label), `x{values,label,fmt,every}`, `y{fmt,min,max}`, `series[{name,color:'--series-n',kind,stack,dashed}]`, `tipFmt`, `tipTitle`, `tipExtra`, `tableFmt` and `tableEvery`. Built in: a hover and touch crosshair tooltip, arrow-key reading (Home and End too), a legend for two or more series, and a "Show the numbers as a table" disclosure. Marks follow the dataviz spec: 2px lines, columns up to 24px wide with a 4px rounded end, a 2px gap between stacked segments, hairline grid. Charts re-render on resize and follow the theme through tokens.

**Calculator fields** (`.field` > `label` above input > `.hint` below). Labels always sit above the field and are never placeholders. Numeric inputs use `inputmode`, `autocomplete="off"` and format on blur with Indian digit grouping.

**Notes** (`textarea[data-notes]`): stored per lesson in browser storage, with a message when storage is blocked.

## 6. Formatting (Teaching Spec §26)

`FA.fmt.inr` gives ₹1,23,456 (Indian grouping). `inrShort` gives ₹12.4 lakh or ₹1.25 crore. `inrAxis` gives ₹12L or ₹1.2Cr (axes only). `pct`, `num`, `months` (3 yr 5 mo). Lakh and crore are never mixed with million and billion in the same analysis.

## 7. Storage and privacy

Browser storage is used only for per-viewer conveniences: theme, progress, notes, the Project 0 draft. Every access is wrapped for failure. Project data is exported through the platform `downloads` capability when available, with a copy-to-clipboard fallback, and imported from a file. Nothing is sent anywhere.

## 8. Accessibility checklist (release-blocking, Spec §53 and §71.6)

Semantic landmarks and one h1 per lesson; no skipped heading levels; a label on every control; visible `:focus-visible` everywhere (sliders show a thumb ring and the skip-link destination is outlined); touch targets ≥ 44px; `aria-live` on feedback and insights; charts have a text description plus a data table; external new-tab links carry an icon and hidden explanatory text; no meaning carried by colour alone; reduced motion honoured; no horizontal overflow at 390px or at 200% zoom; no text below 13px.

## Part scopes and chapter plates (v2.0)

- **`data-part="0…4"`** on any element scopes the Part colour (see 04 §2). Put it on each lesson `<article>`, each lesson-list `<ol>` and its `.rail-part` heading, and on any map node that points at a lesson. The router copies the current lesson's Part to `<html>` and to the previous/next links.
- **Chapter plate.** Inside `.lesson-head`, wrap the kicker, an `aria-hidden` `.plate-no` numeral, the `h1` and the big idea (or lede plus `.meta-row`) in `<div class="plate">`. Keep `.on-page` after the plate. The plate bleeds to the edges of `main` using container units.
- **Rail Part heading.** `<p class="rail-part" data-part="N"><span class="rail-part-no" aria-hidden="true">II</span><span class="visually-hidden">Part II: </span>Name</p>`.
- **Lab bench.** Unchanged markup; `.bench-head` renders as a Part-coloured band, so its purpose text and tags inherit the field ink.
- **Primary button.** Uses `--mark`/`--mark-ink`, the solid Part colour.
