# Source architecture

## Shared layer

`shared/` contains the stable course shell, design tokens, reusable component styles, navigation/runtime behaviour, charts and global glossary. Module code may use these contracts but should not copy or redefine them.

## Module layer

Each `modules/module-XX/` directory contains:

```text
module.json
content/
  head.html
  navigation.html
  lessons/*.html
styles/
  module.css
scripts/
  *.js
```

`module.json` is the integration contract. It records build order for module-specific styles and scripts while lessons are loaded in filename order. Keep reusable UI and behaviour in `shared/`; keep concept-specific diagrams, labs, calculations and project flows in the module.

Use `npm run module:new -- module-01 "How Financial Markets Work"` to create this structure safely.

