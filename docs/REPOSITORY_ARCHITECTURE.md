# Repository architecture

## Purpose

The repository supports two goals at the same time:

1. consistent, reusable authoring across a 26-level curriculum;
2. one standalone HTML artifact per released module.

The source is therefore modular, while the release artifact is intentionally bundled.

## Boundaries

| Layer | Owns | Must not own |
|---|---|---|
| `docs/01_*` and `docs/02_*` | Curriculum and teaching governance | Module-specific implementation detail |
| `docs/foundations/` | Cross-module terminology, visual and quality contracts | One lesson's private styles or logic |
| `docs/modules/module-XX/` | Audited module plan, research and release evidence | Changes to the master syllabus |
| `src/shared/` | Stable shell, tokens, components, common runtime and charts | Concept-specific calculations or lesson prose |
| `src/modules/module-XX/` | Lesson content, module visuals, finance engines, labs and projects | Forked copies of shared components |
| `scripts/` | Build, scaffolding and visual-review tooling | Course content |
| `tests/` | Deterministic calculation and browser-level verification | Generated artifacts |
| `dist/` | Disposable release output | Source edits |

## Module integration contract

Every module has a `module.json`. The build reads that file, then combines:

```text
shared shell + shared styles + shared runtime
                    +
module navigation + ordered lessons + module styles + module scripts
                    ↓
         dist/module-XX/index.html
```

`index.html` is the distributable body. `preview.html` wraps it in a complete document and uses locally installed fonts for repeatable QA.

## Where a change belongs

- A new card, form convention, chart behaviour or navigation pattern belongs in `src/shared/` and must be documented in the matching foundation file.
- A diagram or lab that teaches one module belongs in that module.
- A deterministic financial calculation belongs in a pure module script and should have a unit test.
- A source, date-sensitive fact or release limitation belongs in the module documentation.
- Generated files are never edited directly.

## Adding a module

1. Audit the syllabus scope and prerequisites.
2. Create the module architecture under `docs/modules/module-XX/`.
3. Run `npm run module:new -- module-XX "Title"`.
4. Add lessons incrementally and keep `module.json` current.
5. Build and run proportional unit, interaction, accessibility and visual QA.
6. Add the release record and update `docs/foundations/07_MODULE_REGISTRY.md`.

