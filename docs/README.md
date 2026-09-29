# Documentation map

The documentation is organised by authority and scope so that future module work does not confuse curriculum decisions with implementation history.

## Authoritative program documents

- `01_MASTER_SYLLABUS.md` defines scope, sequence, competencies and required projects. It is the source of truth for **what** is taught.
- `02_TEACHING_DESIGN_SPEC.md` defines pedagogy, interaction, sourcing, accessibility and quality gates. It is the source of truth for **how** it is taught.

These two documents are frozen. Changes require explicit curriculum or design review.

## Cross-module foundations

The `foundations/` directory contains shared contracts used by every module:

- `03_GLOBAL_GLOSSARY.md`
- `04_DESIGN_TOKENS.md`
- `05_COMPONENT_LIBRARY.md`
- `06_SOURCE_POLICY.md`
- `07_MODULE_REGISTRY.md`

When a shared implementation changes, update the matching foundation document in the same change.

## Module records

Each module gets `docs/modules/module-XX/` containing its architecture, research register, audits and release record. These files explain module-specific decisions; they do not override the two authoritative program documents or the shared foundations.

