# Module 0 Release Record

**Module:** 0 · Personal Finance & Wealth Foundations (Syllabus Level 0, sections 0.1 to 0.11, Project 0)
**Version:** 1.1 · redesigned and re-audited 29 Sep 2026 · facts verified 29 Sep 2026
**Artifact:** "Personal Finance Foundations" (single standalone page; private until shared)
**Source:** `src/shared/` (shared system) + `src/modules/module-00/` (content, engine, labs) → `scripts/build.mjs` → `dist/module-00/index.html`

---

## 1. What shipped

- A module overview with a system map, objectives, key questions and the two running households.
- 11 lessons, each following the Spec §4 ladder: why → intuition → prediction → worked example → explorer → formal model → realistic example → misconceptions → failure modes → knowledge check → practice ladder A–E → notes.
- 15 interactive explorers, all computed by one unit-tested engine: bathtub, lifestyle inflation, leverage, compounding, discounting dial, annualisation converter, real return, goal planner, emergency-fund shock simulator, loan lab, minimum-due simulator, risk-pooling simulator, life-cover estimator, tax slab visualiser, Ponzi simulator. Plus a to-scale cash-flow waterfall, a historical CPI chart and a to-scale goals chart.
- 11 predict-then-reveal items, 35 knowledge checks with misconception feedback, 55 practice-ladder items, 3 historical cases (March 2020, Madoff, Saradha), a Quant Lab (amortisation schedule, spreadsheet-first with an optional Python preview), and an AI Lab (auditing a constructed AI answer with six planted errors, plus a verification-loop prompt).
- A module synthesis and a 14-item mastery assessment with a competency summary and a written analysis with a model answer.
- Project 0, the Personal Financial Dashboard: the full income-to-goals chain, nine status cards, rule-based priorities, an asset mix, diagnosis and actions fields, file export and import, undo for deletions, and confirmation before replacing data.

## 2. Concepts introduced and reused

- **Introduced:** 86 glossary terms (listed in 07_MODULE_REGISTRY and 03_GLOBAL_GLOSSARY).
- **Reused:** none (first module).

## 3. Glossary additions

86 new entries in `src/shared/scripts/glossary.js`, mirrored in `docs/foundations/03_GLOBAL_GLOSSARY.md`.

## 4. Project and design decisions

1. **The foundation files were missing, so they were created:** 03 Glossary, 04 Design Tokens, 05 Component Library, 06 Source Policy, 07 Module Registry (Spec §61). 08 Learner Progress is deferred because progress is kept per browser.
2. **Standalone single page.** No framework and no build step for learners. Source stays modular and the build inlines everything (Spec §23, §56).
3. **Visual system.** Ledger-paper neutrals, one ink-blue accent, Schibsted Grotesk + IBM Plex Sans/Mono, native MathML, Phosphor icons inlined as a sprite. Deviations from `design-taste-frontend` are documented with reasons in 04 §7.
4. **Lesson IDs match syllabus IDs** (`#l04` = 0.4) for traceability. Syllabus order is kept; concepts that need later tools are taught as intuition first and quantified later (human capital: 0.1 → 0.9).
5. **Accessibility tokens.** A `--control` border token was added to meet WCAG 1.4.11 (non-text contrast) after the audit.
6. **Privacy.** Project data never leaves the browser. Export uses the platform downloads capability, with a copy fallback.
7. **1.1 visual direction.** Module 0 now behaves like an analyst's household-finance field guide: a stronger ledger-paper shell, a stocks/flows/buffers thesis panel, open chapter plates, structured lab benches and rule-led navigation. The change preserves the teaching sequence and every interaction while replacing the generic card-and-sidebar feel with a reusable editorial system.

## 5. QA results

| Check | Method | Result |
|---|---|---|
| Syllabus coverage | Architecture map (every Level 0 bullet → section) plus a keyword audit of the built page | All 0.1–0.11 bullets and the Project 0 chain present |
| Mathematical correctness | 44 unit tests on `finance.js`; every figure in the prose recomputed during authoring | 44/44 pass. About 15 arithmetic slips in draft text and one display bug ("₹50L" shown as "₹5L") were found and fixed |
| Current facts | Verification register (06 §5) | Tier 1 for most facts; Tier 2 items named (see §7) |
| Pedagogy and structure | Script checks each lesson for big idea, intuition, prediction, formula, example, explorer, misconceptions, limits, checks, ladder A–E, notes | All 11 lessons complete (0.2 and 0.3 carry their worked examples inside the waterfall, balance-sheet and formula blocks) |
| Interactions | `tests/e2e/module-interactions.test.cjs`: every slider swept to its minimum and maximum, all-min and all-max combinations, every select, checkbox and toggle, every quiz answered wrong and then right, predictions revealed | 0 issues at 1280, 640 (200% zoom equivalent) and 390px; no console errors |
| Keyboard and focus | `tests/e2e/module-accessibility.test.cjs`: skip link, 60-stop tab walk with a visible-focus check, slider arrows, chart arrow reading, quiz by keyboard, glossary popover with Escape, focus to h1 on navigation | Pass |
| Mobile | Drawer rail open/close/Escape, touch targets ≥ 40px measured, no horizontal overflow at 390px | Pass |
| Project 0 flows | Add and delete with undo, start-empty confirmation, sample-load confirmation, live recompute, reload persistence, export fallback, import of a valid file and rejection of a malformed one | Pass |
| web-design-guidelines | Current rules fetched 29 Sep 2026 and applied to the 1.1 redesign | Fixed in 1.1: visible focus on the skip-link destination; semantic progress-bar values; external source links disclose new-tab behavior visually and to assistive technology; progress motion uses transforms. Existing justified deviations remain: sentence case (04 §3); no `theme-color` meta because the platform supplies the document head |
| design-taste-frontend | Pre-flight: zero em and en dashes in the output, one accent, one radius system, one theme system, restrained motion, no fake UI screenshots, no hand-drawn icons, mobile and dark screenshots reviewed | Pass, with the deviations in 04 §7 |
| Impeccable | Surface brief, code-led redesign, four-state visual review, anti-pattern detector and independent finish review | Pass; contract and screenshots retained in `.impeccable/` |
| Colour and contrast | WCAG ratios for every token pair in both themes; chart palette through `validate_palette.js` | Text ≥ 4.7:1; controls ≥ 3:1; palette passes CVD checks in both modes (light-mode aqua relies on its legend, the table and dashing) |

## 6. Cross-links later modules must honour

See 07_MODULE_REGISTRY "Forward cross-links". The main ones: PV/annuity → Levels 5 and 7; CAGR/annualisation/XIRR → 8.3–8.5 and 15; CPI and expectations → Level 6; leverage → 9 and 10; expected loss → 11 and 12; after-tax → 23; verification habit → 18; Project 0 → Level 25.

## 7. Current-data dependencies (refresh before each re-release)

Tax slabs, rebate, standard deduction and cess (0.10, and the tax visualiser in `finance.js` `TAX_2026_27`); CPI series facts and latest reading (0.5); inflation target (0.5); DICGC limit (0.7); RBI credit-card and prepayment directions (0.8); IRDAI health rules and GST on insurance (0.9); SEBI @valid and SEBI Check, the 1930 helpline, the cybercrime portal and Sachet (0.11); Madoff recovery figure (0.11).

**Tier 2 items to upgrade to primary sources:** Income-tax Act 2025 effective-date summary (ClearTax), the inflation-target notification (Business Standard), IRDAI circular details (Nyvo, Business Today), SEBI @valid (SCC Online). August 2026 CPI (4.82%) is not shown because it has not been confirmed from a Tier 1 source.

## 8. Known limitations

1. Tested in Chromium only (desktop and mobile emulation). Safari and Firefox should render the same (all features used are standard, including MathML), but this has not been checked.
2. No test with a real screen reader. Structure, labels, live regions and chart text alternatives were audited automatically.
3. The platform downloads capability for Project 0 export could not be exercised in the build environment. The copy fallback was tested, and export fails over to it.
4. Knowledge-check answers are not restored after a reload (lesson completion ticks are). Notes and Project 0 data persist per browser and are lost in private windows unless exported.
5. Fonts come from Google Fonts. Offline, the page falls back to system fonts: usable, but less refined.
6. The tax visualiser is deliberately simplified (new regime, standard deduction only, no surcharge or special-rate income) and labelled "not a tax calculator".
7. Emergency-fund month counts and the life-cover method are teaching heuristics, labelled as such in the page.

## 9. Version history

- **1.0** (29 Sep 2026): initial release.
- **1.0 infrastructure refresh** (29 Sep 2026): source moved into the repository-wide shared/module convention; build and QA moved to a portable root-level Node toolchain. Curriculum and learner-facing content were unchanged.
- **1.1** (29 Sep 2026): redesigned the shared shell and Module 0 opening around a household-system ledger; strengthened responsive hierarchy, lesson chapter plates, benches, navigation and source-link accessibility; retained the complete curriculum and interaction model.
