# 04 · Course Design System and Design Tokens

Version 2.0 · "Swiss textbook colour fields" · redesigned with Module 0 · 29 Sep 2026
Implementation: `src/shared/styles/tokens.css` (tokens), `src/shared/styles/components.css` (components). Every module imports both unchanged. Priority 5 in Teaching Spec §71.1: modules may add concept-specific visuals in their own `module.css`, but may not redefine tokens, type sizes, colours or component styling.

---

## 1. Design read and dials

**Design read.** An interactive textbook for serious, self-directed adult learners in India, in the Swiss/International Typographic tradition: strict grid, one neo-grotesk family, flat saturated colour fields, sharp corners, rules instead of shadows. Long-form reading punctuated by working "lab benches". Native HTML, CSS and vanilla JavaScript, so every module is one standalone page (Teaching Spec §56).

**Dials** (Teaching Spec §71.2): DESIGN_VARIANCE 6 · MOTION_INTENSITY 4 · VISUAL_DENSITY 5. Chapter plates run at about 7 variance (asymmetric numeral, title and big idea); labs run denser (about 6); reading sections are airier (about 4).

**Concept.** *Each syllabus Part owns a colour.* The learner always knows which part of the household system they are in: the Part colour fills the lesson's chapter plate, the current row in the lesson list, the lab header band, the section-head marks, the "your turn" blocks and the next-lesson block. Everything else stays on near-white paper with off-black ink.

## 2. Colour

Cool neutral paper and off-black ink, plus five Part fields. Every token is written once with `light-dark()`; the theme control sets `color-scheme` on the root (`system`, `light`, `dark`). Dark mode is designed, not inverted: fields keep their hue, and large ink fields become raised charcoal rather than flipping a whole section to light.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | #f3f4f5 | #0e1013 | Page ground and lesson list |
| `--surface` | #fcfcfd | #15181c | Reading surface |
| `--surface-2` | #eef0f2 | #1c2025 | Lab body, example wells, stripes |
| `--surface-3` | #e3e6e9 | #262b31 | Stronger neutral bands |
| `--ink` / `--ink-2` / `--ink-3` | #111418 / #3b4148 / #5b626a | #eceef0 / #bfc5cb / #969da5 | Text (ink-3 ≥ 5.4:1 on every ground) |
| `--rule` / `--rule-strong` | #d9dde1 / #b1b7bd | #2a2f35 / #454c54 | Hairlines and structural rules |
| `--control` | #858c93 | #6c747c | Form-control borders (≥ 3:1, WCAG 1.4.11) |
| `--hero` / `--hero-ink` | #15181c / #fcfcfd | #23282e / #eceef0 | The module thesis band |
| `--pos`, `--neg`, `--caution` (+ `-soft`) | unchanged from v1 | unchanged from v1 | Semantic only, always with icon and text |

### Part fields

| Part | `field` light / dark | `field-ink` | `part-text` light / dark (text-safe accent) |
|---|---|---|---|
| 0 · Overview and Integration (ink) | #15181c / #2a3037 | #fcfcfd / #f3f4f5 | #15181c / #eceef0 |
| I · The household as a system (signal yellow) | #f2c12e / #e9b824 | #111418 | #7d5b00 / #f2c64a |
| II · Time and purchasing power (cobalt) | #2340d0 / #3552e0 | #fcfcfd | #2340d0 / #9aabff |
| III · Plans and buffers (forest) | #0b6a47 / #127a53 | #fcfcfd | #0b6a47 / #62d2a2 |
| IV · Threats to the system (vermilion) | #c2410c | #fcfcfd | #b53a0a / #ff9366 |

Measured contrast: every `field-ink` on its field ≥ 5.0:1; every `part-text` on surface and surface-2 ≥ 5.1:1 in both themes.

**Rules**
- **Part scope.** Any element can carry `data-part="0…4"`; it sets `--field`, `--field-ink`, `--part-text`, and re-declares `--accent`, `--accent-soft`, `--accent-line` and `--mark` (custom properties resolve where declared, so aliases must be re-declared per scope). The router copies the current lesson's Part onto `<html>` so the top bar and dialogs follow it.
- **One accent per page.** On any lesson page the only interaction accent is that lesson's Part (`--accent`). `--mark` is the solid Part colour for buttons and small marks; for the ink Part in dark mode it resolves to light ink so primary actions stay prominent.
- Semantic colours are never decorative and always come with an icon and a text label (Teaching Spec §13).

### Chart series
Unchanged validated categorical order: `--series-1` blue, `--series-2` orange, `--series-3` aqua (values in `tokens.css`). Charts use at most three series, always with a legend or direct labels and a data table. Text never takes a series colour.

## 3. Typography

| Token | Family | Use |
|---|---|---|
| `--font-display` / `--font-body` | Geist 400–800 | Titles, headings, body, UI |
| `--font-mono` | Geist Mono 400–600 | Lesson numbers, formula variables, slider values, chart ticks, code |

One neo-grotesk family keeps the Swiss discipline: hierarchy comes from size and weight, not from mixing faces. Both families include ₹ (U+20B9) in their latin-ext subset. Loaded from Google Fonts with `display=swap`; the local preview uses `@fontsource/geist` and `@fontsource/geist-mono`.

| Token | Size | Use |
|---|---|---|
| `--t-plate` | 72–152px | Lesson numeral on the chapter plate (decorative, `aria-hidden`) |
| `--t-module` | 40–64px | Lesson or module title (h1), weight 700, tracking −0.035em |
| `--t-h2` | 28–38px | Major section, weight 700 |
| `--t-h3` | 20–24px | Subsection, lab title |
| `--t-h4` | 18px | Minor heading |
| `--t-body` | 17px, line-height 1.65 | Body |
| `--t-small` | 15px | Supporting text, tables, controls, block labels |
| `--t-micro` | 13px | Tags, axis ticks, metadata only. **Nothing smaller anywhere.** |

Tracking never goes below −0.04em. The reading measure is 68ch. Headings use `text-wrap: balance`, paragraphs `pretty`, aligned numbers `tabular-nums`. Block labels are sentence case at 15px (no uppercase tracked eyebrows).

**Case convention (a deliberate deviation from web-design-guidelines' Title Case rule):** module and lesson titles use Title Case; section headings, labels and buttons use sentence case (Teaching Spec §65).

## 4. Space, shape, elevation, layers

- Space: a 4px base, `--s1` (4px) to `--s9` (96px).
- **Shape rule:** fields, blocks, benches and tags are square (`--r-block: 0`); controls 4px (`--r-control`); fully round only for slider thumbs and radio/checkbox natives. No other radii.
- Elevation: one shadow (`--shadow-pop`) for overlays only (popovers, glossary dialog, chart tooltips, the mobile rail, toasts). Blocks are separated by rules and fields.
- Z-index scale: `--z-sticky` 10, `--z-rail` 30, `--z-pop` 40, `--z-toast` 50. No other values.
- Layout: `--rail-w` 18.5rem, `--bench-w` 68rem, `--topbar-h` 3.75rem. `main` is an inline-size container so chapter plates can bleed to its edges with `cqw` maths. Below 1080px benches stack controls above output; below 900px the rail becomes a drawer and plates become one column; below 560px everything is one column with a 16px gutter and the in-lesson contents become a horizontal scroll strip.

## 5. Motion (MOTION_INTENSITY 4)

Every animation explains a state change, gives feedback, or aids orientation (Teaching Spec §22, §71.4):
- **Chapter change:** the plate wipes in from the left (clip-path, 520ms) and its text slides 12px, then the lesson body rises 8px. It tells the learner they have entered a new chapter.
- Predict-and-reveal and feedback panels fade and rise (260ms).
- The top-bar mark and meter cells change colour or fill as the Part and completion change (260ms).
- Controls: 140ms colour transitions, a 1px press, arrow nudges on primary and next-lesson actions, a slider thumb that grows while dragged.
- Charts update instantly while a slider moves.

`prefers-reduced-motion` removes every named animation and transition. No perpetual loops and no scroll-triggered effects.

## 6. Information-type encoding (Teaching Spec §8)

Every type is recognisable from its label, icon and shape, not from colour alone:

| Type | Shape cue | Icon |
|---|---|---|
| Intuition | Part-tinted field under a 4px Part rule | lightbulb |
| Worked example | Paper well under a 2px ink rule, header row with data tag | calculator |
| Formula | Ruled box under a 4px ink rule, variables in Part-coloured mono | function |
| Caution | Amber wash | warning |
| Common misconception | Red-tinted field under a hatched band, three parts: claim, why it fails, better question | prohibit |
| Investor / Quant / AI lens | Open aside between hairlines | binoculars / chart-line / robot |
| Advanced note | Dashed border, collapsed | book-open |
| Historical case | Heavy top rule, two columns: "at the time" and "afterwards" (hindsight discipline, Spec §38) | clock-counter-clockwise |
| Try it (explorer) | Wide paper bench whose header is a band in the Part colour, controls, readouts, chart and one-sentence insight | sliders-horizontal |
| Predict first / Knowledge check | Ruled card under a 6px Part rule | brain / question |
| Data tags | Hypothetical (dashed), Historical (outlined), Current · verified (green, with date); all square | flask / clock / seal-check |

## 7. Deviations from `design-taste-frontend`, with reasons

| Skill default | Course decision | Reason (precedence, Teaching Spec §71.1) |
|---|---|---|
| React/Next + Tailwind + Motion | Vanilla HTML/CSS/JS, single page | Standalone resilience and no build dependencies for learners (Spec §55–56) |
| Real photography in every page | No photography; diagrams, charts and interactive figures only | Spec §9 forbids decorative and generic imagery; every visual must teach |
| One eyebrow per three sections | One kicker per lesson (inside the plate); sentence-case labels on information blocks | Spec §8 requires learners to recognise information types at a glance; these are component labels, not section eyebrows |
| Icons from a library, not hand-drawn | Phosphor (MIT) SVGs, inlined as a sprite at build time | Complies; external icon CSS is blocked by the artifact CSP |
| Title Case (web-design-guidelines) | Sentence case below titles | Editorial voice; not an accessibility rule |
| Hand-rolled decorative SVG discouraged | None added; Part identity is built from flat CSS fields | Complies |
| Colour consistency lock (one accent per page) | Five Part colours across the course, one per page | Each lesson page still has exactly one accent; the Part system is a documented wayfinding code, not decoration |
