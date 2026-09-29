# Finance Academy agent instructions

These instructions apply to the entire repository.

## Product authority

Before changing curriculum, content, interactions, layout, or styling, read the relevant sources in this order:

1. `docs/01_MASTER_SYLLABUS.md`
2. `docs/02_TEACHING_DESIGN_SPEC.md`
3. `docs/foundations/`
4. The relevant module documentation in `docs/modules/`
5. The relevant source under `src/`

Resolve conflicts in this order: financial truth and safety; syllabus; teaching specification; accessibility and usability; the course design system; external design guidance.

## Required design workflow

For every UI design, redesign, styling, responsive-layout, interaction-polish, or visual-audit task, explicitly use all three installed skills:

1. `$impeccable` for product context, design direction, craft, and bounded visual verification.
2. `$design-taste-frontend` for an audit-first redesign, anti-generic composition, typography, spacing, and its pre-flight review.
3. `$web-design-guidelines` for a fresh standards and accessibility audit of the changed files.

If a skill is unavailable in the current session, say so before editing and follow its documented project rules directly. Do not silently skip it.

Classify lesson surfaces primarily as `Read` and interactive laboratories as `Operate`. Preserve the established design read and default dials from `docs/foundations/04_DESIGN_TOKENS.md`:

- `DESIGN_VARIANCE: 6`
- `MOTION_INTENSITY: 4`
- `VISUAL_DENSITY: 5`

The external skills refine the course-specific system; they do not replace it. Preserve the vanilla HTML, CSS, and JavaScript architecture and the standalone-module build unless the user explicitly approves an architectural migration. Use photography only when it teaches; finance diagrams, charts, and working interactives are the preferred visual assets.

## Implementation rules

- Edit source files under `src/`; never edit generated files under `dist/`.
- Put reusable visual tokens and components in `src/shared/`. Keep only genuinely module-specific presentation in a module folder.
- Preserve curriculum structure, factual copy, URLs, anchor IDs, accessibility behavior, analytics-facing names, and interaction semantics unless the request explicitly changes them.
- Do not invent financial facts, market data, performance claims, testimonials, or fake-precise figures.
- Every animation must explain a relationship, state change, feedback, or orientation. Honor `prefers-reduced-motion`.
- Treat keyboard access, visible focus, WCAG AA contrast, non-color cues, mobile layout, 200% zoom, and horizontal-overflow defects as release requirements.

## Completion checks

After UI changes:

1. Run `npm test`.
2. Build the affected module.
3. Inspect desktop and mobile screenshots in both light and dark modes, in one bounded review pass and at most one confirmation pass.
4. Run the `$web-design-guidelines` review against every changed UI source file.
5. Run the applicable `$design-taste-frontend` pre-flight checks and an `$impeccable` finish pass.
6. Record material design decisions, justified deviations, and QA evidence in the module release record.

