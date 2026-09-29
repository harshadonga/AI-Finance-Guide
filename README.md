# Finance Academy

An interactive, modular learning system for personal finance, investing, trading, quantitative finance and AI-assisted research.

The project deliberately stays framework-light. Source files are modular for maintainability, while each released module is compiled into one standalone HTML artifact for dependable learning and easy distribution.

## Start here

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Run `npm run build`.
4. Open `dist/module-00/preview.html` in a browser.

Useful commands:

| Command | Purpose |
|---|---|
| `npm run build` | Build every module found under `src/modules/` |
| `npm run build:module -- module-00` | Build one module |
| `npm run test:unit` | Verify finance calculations |
| `npm run test:e2e` | Build and run interaction, keyboard and responsive checks |
| `npm run module:new -- module-01 "How Financial Markets Work"` | Scaffold the next module without overwriting existing work |
| `npm run screenshot -- module-00 l04 1280 light` | Capture a module lesson for visual review |

## Source-of-truth order

1. Truth, financial safety and mathematical correctness
2. [`docs/01_MASTER_SYLLABUS.md`](docs/01_MASTER_SYLLABUS.md) — what the program teaches
3. [`docs/02_TEACHING_DESIGN_SPEC.md`](docs/02_TEACHING_DESIGN_SPEC.md) — how it is taught
4. [`docs/foundations/`](docs/foundations/) — shared terminology, design, components, sourcing and module status
5. [`docs/modules/`](docs/modules/) — module-specific planning and release evidence

Generated files in `dist/` are disposable and are intentionally ignored by Git. Edit the source under `src/`, then rebuild.

Repository-wide agent and design-skill rules live in [`AGENTS.md`](AGENTS.md). UI work must use Impeccable, Design Taste, and Web Design Guidelines while keeping the curriculum documents and course-specific design system authoritative.

## Project structure

```text
finance-academy/
├── academy.config.json       Shared build inputs
├── docs/                     Curriculum and product documentation
│   ├── foundations/          Cross-module contracts
│   └── modules/              Module plans and release records
├── scripts/                  Build, scaffold and visual-review tools
├── src/
│   ├── shared/               Reusable runtime, styles and shell
│   └── modules/              One self-contained folder per module
├── tests/
│   ├── unit/                 Calculation tests
│   └── e2e/                  Browser interaction and accessibility checks
└── dist/                     Generated standalone modules (ignored)
```

See [`docs/README.md`](docs/README.md) for documentation governance and [`src/README.md`](src/README.md) for the module contract.
