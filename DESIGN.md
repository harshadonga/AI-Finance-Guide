---
name: "Finance Academy"
description: "Swiss textbook colour fields: every syllabus Part owns a colour, and the page reads like a disciplined modern textbook."
colors:
  paper: "#f3f4f5"
  reading-paper: "#fcfcfd"
  well-paper: "#eef0f2"
  band-paper: "#e3e6e9"
  ink: "#111418"
  secondary-ink: "#3b4148"
  supporting-ink: "#5b626a"
  rule: "#d9dde1"
  strong-rule: "#b1b7bd"
  control-gray: "#858c93"
  part-0-ink: "#15181c"
  part-1-yellow: "#f2c12e"
  part-1-text: "#7d5b00"
  part-2-cobalt: "#2340d0"
  part-3-forest: "#0b6a47"
  part-4-vermilion: "#c2410c"
  part-4-text: "#b53a0a"
  positive: "#1b6e40"
  positive-soft: "#e3f1e8"
  negative: "#b3261e"
  negative-soft: "#f9e6e4"
  caution: "#845400"
  caution-soft: "#f8eed8"
  chart-blue: "#2a78d6"
  chart-orange: "#eb6834"
  chart-aqua: "#1baf7a"
typography:
  plate-numeral:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(4.5rem, 2.6rem + 7.5vw, 9.5rem)"
    fontWeight: 700
    lineHeight: 0.82
    letterSpacing: "-0.04em"
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.7rem + 2.8vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.45rem + 1vw, 2.375rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.028em"
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.15rem + 0.45vw, 1.5rem)"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: "-0.005em"
  value:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  block: "0"
  control: "4px"
  thumb: "999px"
spacing:
  s1: "0.25rem"
  s2: "0.5rem"
  s3: "0.75rem"
  s4: "1rem"
  s5: "1.5rem"
  s6: "2rem"
  s7: "3rem"
  s8: "4.5rem"
  s9: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.part-2-cobalt}"
    textColor: "{colors.reading-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
    height: "2.75rem"
  button-default:
    backgroundColor: "{colors.reading-paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
    height: "2.75rem"
  chapter-plate:
    backgroundColor: "{colors.part-2-cobalt}"
    textColor: "{colors.reading-paper}"
    typography: "{typography.display}"
    rounded: "{rounded.block}"
    padding: "1.5rem 4.5rem 2rem"
  lab-bench:
    backgroundColor: "{colors.well-paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.block}"
    padding: "0 2rem 2rem"
  thesis-band:
    backgroundColor: "{colors.part-0-ink}"
    textColor: "{colors.reading-paper}"
    typography: "{typography.body}"
    rounded: "{rounded.block}"
    padding: "2rem"
---

# Design System: Finance Academy

## Overview

**Creative North Star: "Swiss textbook colour fields"**

Finance Academy reads like a disciplined modern textbook in the International Typographic tradition: one neo-grotesk family, a strict grid, flat saturated colour fields, sharp corners and rules instead of shadows. Each syllabus Part owns a colour, so the learner always knows where they are in the household system. Everything that is not a Part field is near-white paper and off-black ink, which keeps long reading calm.

**Key characteristics:**

- A full-bleed chapter plate opens every lesson: giant lesson numeral, title and big idea on the Part colour.
- The current Part colour is the page's single interaction accent.
- Hierarchy from size, weight and heavy rules; no shadows on content, no soft cards.
- Labs are paper benches with a Part-coloured header band.
- Purposeful motion only: variance 6, motion 4, density 5.

## Colors

Near-white cool paper, off-black ink and five Part fields. Tokens use `light-dark()` so one declaration covers both themes; `color-scheme` on the root selects system, light or dark.

### Part fields

- **Part 0 · Overview and Integration (Ink):** the module's structural colour. In dark mode its large fields become raised charcoal, and its marks and buttons become light ink.
- **Part I · The household as a system (Signal Yellow):** ink text on the field; text-safe ochre for links and focus.
- **Part II · Time and purchasing power (Cobalt).**
- **Part III · Plans and buffers (Forest).**
- **Part IV · Threats to the system (Vermilion):** kept distinct from the semantic negative red.

### Semantic and chart colours

Positive, Negative and Caution keep their soft companions and always carry an icon or label. Chart Blue, Orange and Aqua remain the validated three-series order; chart text stays neutral.

### Named Rules

**The Part Scope Rule.** `data-part` on any element sets that Part's field, field ink, text-safe accent and mark. Aliases (`--accent`, `--accent-soft`, `--mark`) are re-declared per scope because custom properties resolve where they are declared.

**The One Accent Per Page Rule.** A lesson page uses only its own Part colour for interaction; semantic colours never decorate.

**The No Section Flip Rule.** Dark mode never turns a whole section light; large ink fields become charcoal.

## Typography

**Family:** Geist (400 to 800) for display, headings, body and UI. **Values:** Geist Mono (400 to 600) for lesson numbers, formula variables, readout inputs, chart ticks and code. Both include the rupee sign.

### Hierarchy

- **Plate numeral** (700, 72 to 152px, tracking -0.04em): the lesson number on its chapter plate, `aria-hidden`.
- **Display** (700, 40 to 64px): module and lesson titles.
- **Headline** (700, 28 to 38px): major sections, each preceded by a short 6px Part-coloured mark.
- **Title** (650, 20 to 24px): subsections and compact structures.
- **Body** (400, 17px, 1.65): sustained reading within 68ch.
- **Label** (650, 15px, sentence case): information-type labels; no uppercase tracked eyebrows.
- **Micro** (13px): tags, ticks and metadata only; nothing is smaller.

## Layout

A 3.75rem sticky top bar, an 18.5rem lesson list, and a reading surface with a 68rem bench. `main` is an inline-size container, so chapter plates bleed edge to edge and keep their content aligned to the bench. Prose stays at 68ch; labs, cases, diagrams and the overview widen to the bench. Below 1080px bench controls stack; below 900px the list becomes a drawer and plates become one column; below 560px the page is one column with a 16px gutter and the in-lesson contents become a horizontal strip.

## Elevation and Shape

Flat. Fields, blocks, benches and tags are square; controls have a 4px radius; only slider thumbs are round. One shadow token exists for overlays (popovers, glossary dialog, tooltips, drawer, toast).

## Components

- **Chapter plate:** Part field, kicker line above a thin rule, numeral top left, title bottom left, big idea (or lede and facts) bottom right under a 3px rule. Draws in from the left when a lesson opens.
- **In-lesson contents:** a ruled strip under the plate; the hovered link gains a Part-coloured underline.
- **Lesson list:** Part squares with Roman numerals; the current lesson is a filled row in its Part colour.
- **Progress meter:** 15 cells, one per lesson, filled in ink.
- **Blocks:** Intuition (Part tint, 4px Part rule), Example (paper well, 2px ink rule), Formula (ruled box, 4px ink rule), Caution (amber, 2px rule), Misconception (red tint, hatched band), Lens (rules only), Predict and Check (ruled card, 6px Part rule).
- **Lab bench:** Part-coloured header band with the lab's question as a headline; paper body with controls divided from output by a rule; readouts in large tabular type under ink rules.
- **Next lesson:** a large block in the next lesson's Part colour; previous lesson is a neutral paper block.
- **Overview:** oversized title and facts beside a stacked Part index whose field heights follow lesson counts; the stocks-flows-buffers thesis as an ink band; the system map with Part-coloured lesson numbers and labelled force directions (grows, drains, protects).

Motion: 140ms control transitions, 260ms reveals, a 520ms plate wipe on chapter change. `prefers-reduced-motion` removes all of it.

## Do's and Don'ts

### Do

- Put a lesson's identity in its Part field, and keep reading content on paper.
- Use rules and weight for hierarchy before adding a box.
- Pair every semantic colour with an icon, label or pattern.
- Keep controls at least 44px and focus rings visible in the Part accent.
- Check new Part colours for field-ink and text-safe contrast in both themes.

### Don't

- Don't add shadows, rounded cards, gradients or glass to content.
- Don't mix in another typeface or a serif.
- Don't use a Part colour outside its Part, or add a second accent on one page.
- Don't flip a section to the opposite theme.
- Don't reduce text below 13px or body below 17px.
- Don't animate anything that does not explain state, feedback or orientation.
