# Module 1 Release Record

**Module:** 1 · How Financial Markets Work

**Version:** 1.0

**Release audit:** 30 Sep 2026
**Artifact:** `dist/module-01/index.html`, generated from `src/modules/module-01/`

## What shipped

- Module overview, 13 syllabus lessons, synthesis and mastery assessment.
- Five teaching interactions: trade trace, order-state laboratory, visible order book, index builder and corporate-action workbench.
- Twenty lesson checks plus a ten-item mastery assessment and written transfer task.
- A pure market-mechanics engine with unit tests for spread, book walking, capitalisation, index weights, splits, rights, returns and order states.
- Primary-source links for update-sensitive Indian market facts.

## Material design decisions

- The established Swiss textbook system and positional Part colours are reused unchanged.
- The order book is an actual deterministic model, not a decorative trading-terminal imitation.
- Charts, diagrams and ledgers carry the visual work. Photography would not improve these learning claims and was not used.
- Every animation is either shared orientation, feedback or a learner-controlled state transition.
- Current data was deliberately minimised. Hypothetical prices and companies are labelled rather than presented as live.

## QA evidence

- `npm test`: passed. Module 0 finance engine 44/44; Module 1 market engine 16/16; both standalone modules built; interaction and keyboard/accessibility suites passed for both modules.
- Module 1 interaction sweep: 0 issues at 1280px, 640px and 390px; no console errors or invalid readouts.
- Visual confirmation: lesson 1.9 inspected at 1280px and 390px in light and dark modes. All four captures reported 0px horizontal overflow and no console or resource errors.
- Web Interface Guidelines review: passed after converting the visible order book to a semantic table, naming new controls, declaring non-auth autocomplete behaviour and adding the missing hover state to the trace controls.
- Design Taste pre-flight: passed. One visual thesis per lesson, deliberate Swiss colour fields, restrained control radii, no decorative gradients or generic dashboard cards, explicit mobile compositions and no unmotivated animation.
- Impeccable finish pass: detector reported 0 anti-patterns. Its 17 advisory colour notes were reviewed as false positives for the established computed `--ink` token; no literal black was introduced in Module 1 source.
- Screenshots: `dist/shots/module-01-l09-1280-light.png`, `dist/shots/module-01-l09-1280-dark.png`, `dist/shots/module-01-l09-390-light.png` and `dist/shots/module-01-l09-390-dark.png`.

The Impeccable sidecar predates the current `DESIGN.md`. It was not regenerated during this module build; the repository design documents and source tokens remained authoritative.

## Current-data dependencies

- Indian cash-equity settlement cycle and optional T+0 scope.
- SEBI broker-registration lookup and investor guidance.
- NSDL/CDSL depository structure.
- Nifty 50 free-float methodology.

Refresh these claims before a later release. Do not update historical lesson language silently.

## Known limitations

- The visible order book is deterministic and intentionally shallow. It teaches price and depth, not exchange-grade matching.
- The module does not use live prices or licensed historical datasets.
- Browser QA currently targets Chromium. A real screen-reader pass remains recommended.
- Tax effects of corporate actions are deferred to Level 23.
