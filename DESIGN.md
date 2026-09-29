---
name: "Finance Academy"
description: "The Household Ledger: a calm editorial field guide for financial judgment."
colors:
  ledger-paper: "#e9eeeb"
  reading-paper: "#fbfdfc"
  recessed-paper: "#eef2f0"
  band-paper: "#e2e8e5"
  household-ink: "#15201c"
  secondary-ink: "#3f4b47"
  supporting-ink: "#5e6a66"
  ledger-rule: "#d3dad7"
  strong-rule: "#aeb8b4"
  control-gray: "#858f8b"
  instrument-blue: "#2344a6"
  instrument-blue-ink: "#ffffff"
  instrument-blue-soft: "#e4e9f7"
  instrument-blue-line: "#8ea0d8"
  working-green: "#132c25"
  working-green-ink: "#f1f6f3"
  working-green-muted: "#b8c9c2"
  working-green-rule: "#38584e"
  positive: "#1b6e40"
  positive-soft: "#e3f1e8"
  negative: "#b3261e"
  negative-soft: "#f9e6e4"
  caution: "#845400"
  caution-soft: "#f8eed8"
  chart-blue: "#2a78d6"
  chart-orange: "#eb6834"
  chart-aqua: "#1baf7a"
  chart-muted: "#a9b3af"
  chart-grid: "#e1e6e4"
  chart-axis: "#b9c2be"
typography:
  display:
    fontFamily: "Schibsted Grotesk, IBM Plex Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.25rem, 1.7rem + 2.2vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Schibsted Grotesk, IBM Plex Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.625rem, 1.4rem + 0.9vw, 2rem)"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.012em"
  title:
    fontFamily: "Schibsted Grotesk, IBM Plex Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.25rem, 1.15rem + 0.45vw, 1.5rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
  body:
    fontFamily: "IBM Plex Sans, system-ui, -apple-system, Segoe UI, Noto Sans, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "IBM Plex Sans, system-ui, -apple-system, Segoe UI, Noto Sans, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.06em"
  value:
    fontFamily: "IBM Plex Mono, IBM Plex Sans, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  control: "6px"
  block: "10px"
  pill: "999px"
spacing:
  s1: "0.25rem"
  s2: "0.5rem"
  s3: "0.75rem"
  s4: "1rem"
  s5: "1.5rem"
  s6: "2rem"
  s7: "3rem"
  s8: "4.5rem"
components:
  button-default:
    backgroundColor: "{colors.reading-paper}"
    textColor: "{colors.household-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
    height: "2.75rem"
  button-primary:
    backgroundColor: "{colors.instrument-blue}"
    textColor: "{colors.instrument-blue-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
    height: "2.75rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.household-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
    height: "2.75rem"
  input:
    backgroundColor: "{colors.reading-paper}"
    textColor: "{colors.household-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0.5rem 0.75rem"
    height: "2.75rem"
  data-tag:
    backgroundColor: "transparent"
    textColor: "{colors.secondary-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.15em 0.6em"
  navigation-item:
    backgroundColor: "transparent"
    textColor: "{colors.secondary-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.5rem 0.75rem"
    height: "2.5rem"
  information-block:
    backgroundColor: "{colors.reading-paper}"
    textColor: "{colors.household-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.block}"
    padding: "1rem 1.5rem"
  lab-bench:
    backgroundColor: "{colors.recessed-paper}"
    textColor: "{colors.household-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.block}"
    padding: "2rem"
  thesis-panel:
    backgroundColor: "{colors.working-green}"
    textColor: "{colors.working-green-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.block}"
    padding: "2rem"
---

# Design System: Finance Academy

## Overview

**Creative North Star: "The Household Ledger"**

Finance Academy is guided by The Household Ledger: a calm, analytical, precise, editorial environment for serious adult learning. It feels trustworthy and exacting without institutional coldness, combining ledger-paper neutrals, Household Ink, tabular numerals, and structural rules with open space for sustained reading.

The system behaves like an analyst's field guide to one household system rather than a collection of generic cards. Open ledgers, ruled bands, working benches, and one high-contrast teaching panel establish hierarchy; diagrams, charts, and interactive figures carry the visual argument because every visual must teach.

**Key Characteristics:**

- Calm, adult editorial tone with a 68ch reading measure.
- Flat, structural hierarchy built from rules, tonal surfaces, and deliberate scale.
- One Instrument Blue interaction accent plus semantic colors that always carry non-color cues.
- Persistent ledger navigation and wide working benches connecting reading to calculation.
- Purposeful motion only: variance 6, motion 4, density 5.

## Colors

The palette uses cool green-gray ledger papers, deep household inks, and one disciplined blue interaction accent; the darker theme is separately designed rather than mechanically inverted.

### Primary

- **Instrument Blue:** The sole interaction, focus, and emphasis color. Its soft tint marks selected states and intuition, while its line tone supports inset outlines.

### Secondary

- **Working Green:** The high-contrast structural ink used for the module thesis panel and other rare teaching moments. It is not a second interaction accent.

### Tertiary

- **Positive, Negative, and Caution:** Semantic status colors for gains and correct states, losses and errors, and warnings. Each has a soft companion surface and must carry a non-color cue.
- **Chart Blue, Chart Orange, and Chart Aqua:** A validated three-series order for comparative data. Chart Aqua uses dashed secondary encoding where contrast requires it; chart text stays neutral.

### Neutral

- **Ledger Paper:** The page ground and navigation chrome.
- **Reading Paper:** The primary reading surface and ordinary control ground.
- **Recessed Paper and Band Paper:** Working wells, table stripes, code fields, and stronger neutral bands.
- **Household Ink:** Primary copy, structural marks, and major rules.
- **Secondary Ink and Supporting Ink:** Explanatory text, labels, axes, and metadata with verified contrast.
- **Ledger Rule, Strong Rule, and Control Gray:** Hairlines, structural dividers, and form-control boundaries.

### Named Rules

**The One Instrument Rule.** Instrument Blue is the only interaction accent; semantic colors are never decorative and always pair with icon, text, or pattern.

**The Designed Dark Rule.** Dark mode is a deliberate token mapping, not an automatic inversion.

## Typography

**Display Font:** Schibsted Grotesk (with IBM Plex Sans and system sans fallbacks)  
**Body Font:** IBM Plex Sans (with system and Noto Sans fallbacks)  
**Label/Mono Font:** IBM Plex Mono (with IBM Plex Sans and system monospace fallbacks)

**Character:** A workhorse grotesk and sans pairing keeps long lessons clear while preserving enough editorial authority for chapter plates. Monospaced numerals make rupees, percentages, formulas, lesson numbers, and readouts feel measured rather than ornamental.

### Hierarchy

- **Display** (700, responsive 36-48px, 1.2): Module and lesson titles; the Module 0 opening may expand to 75px for its singular chapter plate.
- **Headline** (650, responsive 26-32px, 1.2): Major lesson sections.
- **Title** (600, responsive 20-24px, 1.2): Subsections, laboratory titles, and compact teaching structures.
- **Body** (400, 17px, 1.65): Sustained reading within a 68ch measure.
- **Label** (600, 13px, 0.06em): Information-type labels, tags, metadata, and axis ticks; uppercase is reserved for recognizable component labels.
- **Value** (500, 15px, tabular numerals): Formula variables, lesson numbers, input values, and aligned financial figures.

### Named Rules

**The 13-Pixel Floor Rule.** Labels and axis ticks may use 13px; no text may be smaller.

**The Editorial Case Rule.** Module and lesson titles use title case; section headings, controls, and labels use sentence case.

## Layout

The core frame is a reading desk: a 4rem sticky top bar, an 18.5rem persistent module ledger, and a reading surface centered inside a 64rem maximum bench. Ordinary prose stays within 68ch. Chapter plates, cases, diagrams, and interactive laboratories may widen to the bench when comparison or manipulation needs room.

Spacing follows a 4px base from 0.25rem through 4.5rem and uses layout gaps instead of ad-hoc margins. Reading sections are intentionally airier than laboratories: the overall density dial is 5, with lessons near 4 and working benches near 6.

Below 1080px, bench controls stack above their output. Below 900px, the rail becomes a focus-managed drawer. Below 560px, the page becomes one column with a 16px gutter, compact top-bar controls, and single-column navigation. Mobile layouts, 200% zoom, and horizontal-overflow checks are release requirements.

**The Read-Then-Operate Rule.** Lessons stay within 68ch, while explorers, cases, and diagrams may widen to the 64rem bench.

## Elevation & Depth

The system is flat and structural. Tonal surfaces, inset rules, heavy opening rules, and scale establish hierarchy. One shadow token exists only for genuine overlays: popovers, glossary dialogs, chart tooltips, the mobile rail, and toasts. Ordinary cards and teaching blocks remain on the page plane.

### Shadow Vocabulary

- **Popover:** A tight 1px contact shadow plus a broad low-opacity ambient shadow, used only when a surface must visibly float above the document.

### Named Rules

**The Flat Ledger Rule.** Rules and tonal surfaces create hierarchy; shadows are reserved for true overlays, the mobile rail, tooltips, and toasts.

## Shapes

Corners are gently mechanical rather than soft or playful. Controls use a 6px radius, blocks and working benches use a 10px radius, and tags or chips use a full pill. Rule-led asides may deliberately return to square corners, while chart bars use a restrained 4px end radius as data geometry rather than container chrome.

**The Three-Radius Rule.** Controls use 6px, blocks use 10px, and tags use a full pill; no other radii belong in shared components.

## Components

Components are restrained working instruments. Their identity comes from a clear label, structural rule, state, and teaching purpose rather than decorative card treatment.

### Buttons

- **Shape:** Compact controls with gently rounded corners (6px) and a 44px minimum touch height.
- **Primary:** Instrument Blue with white text, a matching border, and 16px horizontal padding.
- **Hover / Focus:** A slightly ink-darkened hover, a 1px press, and a 2px Instrument Blue focus ring. Color and movement use the 140ms fast transition.
- **Default / Ghost:** Reading Paper with a Strong Rule border for default actions; transparent at rest with a recessed-paper hover for ghost actions.

### Chips

- **Style:** Fully rounded 13px labels with compact padding. Hypothetical is dashed, Historical is outlined, and Current is a Positive-on-soft treatment.
- **State:** Status chips pair text and icon with color. Instrument selection uses a soft-blue ground plus weight, never color alone.

### Cards / Containers

- **Corner Style:** Teaching blocks use the shared 10px block radius; quiet lenses use open horizontal rules and square corners.
- **Background:** Reading Paper for examples, formulas, quizzes, and cases; soft semantic surfaces for intuition, caution, and misconception.
- **Shadow Strategy:** Flat at rest; boundaries are rules, tints, inset strokes, or strong top rules.
- **Border:** Hairline Ledger Rule for ordinary structure and Strong Rule for formula or assessment emphasis.
- **Internal Padding:** 16px by 24px on desktop, compressing to 16px on narrow screens.

### Inputs / Fields

- **Style:** Labels sit above fields. Reading Paper, a Control Gray 1px border, 6px corners, 44px minimum height, tabular numerals, and 8px by 12px internal padding.
- **Focus:** Instrument Blue border plus a 2px focus outline with no offset.
- **Error / Disabled:** Error states pair Negative color with text or an icon; disabled actions use reduced opacity and a not-allowed cursor.

### Navigation

The sticky ledger rail lists syllabus numbers in mono, lesson titles in the body face, and completion as a labeled tick. Hover uses Recessed Paper; the active lesson uses Instrument Blue Soft, weight, and an inset Instrument Blue Line. Below 900px the rail becomes a shadowed drawer that closes with Escape and returns focus to its trigger. Previous and next links remain open, rule-led rows rather than cards.

### Lab Bench

The signature explorer is a 10px Recessed Paper working surface with a 3px inset Household Ink rule. Its header states what the learner should notice, controls occupy a bounded column, and outputs combine tabular readouts, a chart, a text alternative, and a live explanatory sentence. At 1080px, controls stack above output.

### Thesis Panel

The rare high-contrast Working Green panel is reserved for a governing model, such as the relationship between flows, stocks, and buffers. It uses pale ink, muted labels, ruled rows, and no shadow; it must teach the structure immediately rather than behave as decorative hero art.

Motion is purposeful and modest: 140ms for control state changes, 260ms for orientation or reveal, and a 1px press for tactile feedback. `prefers-reduced-motion` removes named transitions and animations, and charts update immediately while a control moves.

### Named Rules

**The Working Instrument Rule.** Components must teach, control, compare, or report state; they must never become decorative card chrome.

**The Explained Motion Rule.** Motion must explain state, feedback, or orientation; perpetual loops and decorative scroll effects do not belong.

## Do's and Don'ts

### Do:

- **Do** use open ledgers, ruled bands, and generous measure before adding another boxed container.
- **Do** keep lesson prose at 68ch and let genuine laboratories, cases, and diagrams widen to the 64rem bench.
- **Do** pair every semantic color with an icon, label, border, or pattern so meaning never depends on hue alone.
- **Do** keep controls touch-friendly at a minimum 44px and preserve visible `:focus-visible` treatment.
- **Do** use diagrams, charts, and interactive figures when a visual clarifies a financial relationship.
- **Do** make dark mode, reduced motion, mobile layout, 200% zoom, and data-table chart alternatives part of the component contract.

### Don't:

- **Don't** add warm cream, serif editorial styling, purple gradients, neon-on-black treatments, or generic AI-generated aesthetics.
- **Don't** use photography or raster decoration unless it directly teaches; no generated raster assets belong in this system.
- **Don't** use shadows to make ordinary content blocks look elevated.
- **Don't** invent radii, spacing steps, z-index values, or module-specific colors outside the shared tokens.
- **Don't** reduce labels below 13px or body copy below 17px.
- **Don't** turn study into gamification or animate anything that does not explain state, feedback, or orientation.
