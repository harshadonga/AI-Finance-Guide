# 04 · Course Design System and Design Tokens

Version 1.0 · established with Module 0 · 29 Sep 2026
Implementation: `src/shared/styles/tokens.css` (tokens), `src/shared/styles/components.css` (components). Every module imports both unchanged. Priority 5 in Teaching Spec §71.1: modules may add concept-specific visuals in their own `module.css`, but may not redefine tokens, type sizes, colours or component styling.

---

## 1. Design read and dials

**Design read.** An editorial learning environment for serious, self-directed adult learners in India: calm, analytical and precise. Long-form reading punctuated by interactive "lab bench" explorers. Built with native HTML, CSS and vanilla JavaScript, with no framework, so that every module is one standalone page (Teaching Spec §56).

**Dials** (project calibration, Teaching Spec §71.2): DESIGN_VARIANCE 6 · MOTION_INTENSITY 4 · VISUAL_DENSITY 5. Labs may run denser (around 6); reading sections are airier (around 4).

**Concept.** *An analyst's field guide.* A fixed module ledger on the left, a 68-character reading column, open chapter plates and wider working-bench breakouts for explorers, cases and diagrams. Module openings may introduce one high-contrast thesis panel when it teaches the system's governing model rather than decorating the page.

## 2. Colour

Cool, very slightly green-grey neutrals ("ledger paper") with one ink-blue accent. The palette deliberately avoids the common AI looks: warm cream with a serif, purple gradients, neon on black.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | #e9eeeb | #0d1411 | Page ground and navigation chrome |
| `--surface` | #fbfdfc | #131d19 | Reading surface |
| `--surface-2` | #eef2f0 | #1b2722 | Working benches, wells, stripes, code |
| `--surface-3` | #e2e8e5 | #25322c | Stronger neutral bands |
| `--ink` | #15201c | #e4ebe8 | Primary text |
| `--ink-2` | #3f4b47 | #b9c4bf | Secondary text |
| `--ink-3` | #5e6a66 | #93a09a | Supporting text, axis labels (≥ 4.7:1 on every surface) |
| `--rule` / `--rule-strong` | #d3dad7 / #aeb8b4 | #2c3733 / #46534e | Hairlines; decorative strong rules |
| `--control` | #858f8b | #68766f | Form-control borders and slider tracks (≥ 3:1, WCAG 1.4.11) |
| `--accent` | #2344a6 | #9db1f5 | The single accent: interaction, focus, emphasis (8.3:1 on surface) |
| `--accent-soft` | #e4e9f7 | #1d2745 | Intuition blocks, selected states |
| `--hero` / `--hero-ink` | #132c25 / #f1f6f3 | #16223f / #f1f4ff | Structural thesis panel and its text; not a second interaction accent |
| `--hero-muted` / `--hero-rule` | #b8c9c2 / #38584e | #bdc7e3 / #40517d | Supporting labels and ledger rules inside thesis panels |
| `--pos` / `--pos-soft` | #1b6e40 / #e3f1e8 | #6fcf97 / #16291f | Semantic: on track, gain, correct |
| `--neg` / `--neg-soft` | #b3261e / #f9e6e4 | #f29b90 / #33191a | Semantic: act, loss, incorrect, misconception |
| `--caution` / `--caution-soft` | #845400 / #f8eed8 | #e8b95e / #2e2413 | Semantic: caution blocks, watch |

**Rules**
- One accent per page, always `--accent`. Semantic colours are never decorative and always come with an icon and a text label (Teaching Spec §13).
- Dark mode is designed, not inverted, and every token is redefined in both dark scopes (`prefers-color-scheme` guarded by `:not([data-theme="light"])`, and `[data-theme="dark"]`). A three-state theme control (system, light, dark) sits in the top bar.
- Contrast was verified for every text/background pair in both themes (all text pairs ≥ 4.7:1).

### Chart series
Validated categorical order, taken from the dataviz reference palette: `--series-1` blue #2a78d6 / #3987e5, `--series-2` orange #eb6834 / #d95926, `--series-3` aqua #1baf7a / #199e70. `validate_palette.js` passes all checks in both modes (worst adjacent CVD ΔE 9.2 light, 9.4 dark). Light-mode aqua is below 3:1 against the surface, so every chart carries a legend or direct labels and a data table, and aqua is only used with a dashed line as secondary encoding. Charts use at most three series. Text never takes a series colour.

## 3. Typography

| Token | Family | Use |
|---|---|---|
| `--font-display` | Schibsted Grotesk 500–700 | Titles, headings, big ideas, readout values |
| `--font-body` | IBM Plex Sans 400–700 | Body, UI, labels |
| `--font-mono` | IBM Plex Mono 400–600 | Lesson numbers, formula variables, slider values, code |

Loaded from Google Fonts with `display=swap`. Only IBM Plex Sans includes the ₹ glyph, so every stack falls back to Plex Sans for ₹. Mathematics is native MathML, so no maths library is loaded.

| Token | Size | Use |
|---|---|---|
| `--t-module` | 36–48px (clamp) | Lesson or module title (h1) |
| `--t-h2` | 26–32px | Major section |
| `--t-h3` | 20–24px | Subsection, lab title |
| `--t-h4` | 18px | Minor heading |
| `--t-body` | 17px, line-height 1.65 | Body |
| `--t-small` | 15px | Supporting text, tables, controls |
| `--t-micro` | 13px | Labels, tags, axis ticks only. **Nothing smaller anywhere.** |

The reading measure is 68ch. Headings use `text-wrap: balance`, paragraphs `pretty`. Numbers that line up use `tabular-nums`. The build step converts quotes and apostrophes to their curly forms and joins numbers to their units (₹1.5&nbsp;lakh) with non-breaking spaces.

**Case convention (a deliberate deviation from web-design-guidelines' Title Case rule):** module and lesson titles use Title Case; section headings, labels and buttons use sentence case, in keeping with Indian and British editorial practice and the calmer voice of Teaching Spec §65.

## 4. Space, shape, elevation, layers

- Space: a 4px base, `--s1` (4px) to `--s8` (72px). Lay out with flex and grid `gap`, not ad-hoc margins.
- **Shape rule:** controls 6px (`--r-control`), blocks and benches 10px (`--r-block`), tags and chips fully rounded (`--r-pill`). No other radii.
- Elevation: one shadow (`--shadow-pop`), used only for popovers, the glossary dialog, chart tooltips, the mobile rail and toasts. Blocks are separated by rules and tints, not shadows.
- Z-index scale: `--z-sticky` 10 (top bar), `--z-rail` 30 (mobile rail), `--z-pop` 40 (popovers, tooltips), `--z-toast` 50. No other z-index values.
- Layout: `--rail-w` 18.5rem, `--bench-w` 64rem, `--topbar-h` 4rem. Below 900px the rail becomes a drawer; below 1080px benches stack their controls above the output; below 560px everything is one column with a 16px gutter.

## 5. Motion (MOTION_INTENSITY 4)

Every animation must explain a state change, give feedback, or aid orientation (Teaching Spec §22, §71.4):
- a lesson entrance fade and 6px rise (260ms) for orientation when changing lessons;
- predict-and-reveal and feedback panels fade in (260ms);
- the bathtub figure fills once, showing a stock building up;
- controls: 140ms colour transitions and a 1px press;
- charts update instantly while a slider moves, because a delay would hide the relationship between input and output.

`prefers-reduced-motion` removes the named transitions and animations without globally collapsing browser timing. No perpetual loops and no scroll-triggered effects.

## 6. Information-type encoding (Teaching Spec §8)

Every type is recognisable from its label, icon and shape, not from colour alone:

| Type | Shape cue | Icon |
|---|---|---|
| Intuition | Accent tint with a fine top rule | lightbulb |
| Worked example | Surface card, header row with data tag | calculator |
| Formula | Ruled "ledger" box with a variables table | function |
| Caution | Amber wash | warning |
| Common misconception | Red-tinted field with a strong top rule, three parts: claim, why it fails, better question | prohibit |
| Investor / Quant / AI lens | Open aside between hairlines | binoculars / chart-line / robot |
| Advanced note | Dashed border, collapsed | book-open |
| Historical case | Heavy top rule, two columns: "at the time" and "afterwards" (hindsight discipline, Spec §38) | clock-counter-clockwise |
| Try it (explorer) | Wide neutral working bench with an inset ink rule, controls, readouts, chart and one-sentence insight | sliders-horizontal |
| Predict first / Knowledge check | Surface card with accent label | brain / question |
| Data tags | Hypothetical (dashed pill), Historical (outlined pill), Current · verified (green pill with date) | flask / clock / seal-check |

## 7. Deviations from `design-taste-frontend`, with reasons

| Skill default | Course decision | Reason (precedence, Teaching Spec §71.1) |
|---|---|---|
| React/Next + Tailwind + Motion | Vanilla HTML/CSS/JS, single page | Standalone resilience and no build dependencies for learners (Spec §55–56) |
| Real photography in every page | No photography; diagrams, charts and interactive figures only | Spec §9 forbids decorative and generic imagery; every visual must teach |
| One eyebrow per three sections | One kicker per lesson; uppercase labels on information blocks | Spec §8 requires learners to recognise information types at a glance; these are component labels, not section eyebrows |
| Icons from a library, not hand-drawn | Phosphor (MIT) SVGs, inlined as a sprite at build time | Complies; external icon CSS is blocked by the artifact CSP |
| Title Case (web-design-guidelines) | Sentence case below titles | Editorial voice; not an accessibility rule |
