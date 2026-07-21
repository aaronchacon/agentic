# @ng-agentic/themes

Framework-agnostic **3-layer design tokens** and theme presets for
[`@ng-agentic/core`](https://www.npmjs.com/package/@ng-agentic/core). Tokens compile to CSS custom
properties, so a single value cascades across every component — swap a preset or override any token,
nothing forks.

![License: MIT](https://img.shields.io/badge/License-MIT-informational)

## The three layers

```
primitive   →   semantic        →   component
{red.500}       ai.color             chat.composerRadius
#8b5cf6         primary.color        summary.accent
```

- **Primitive** — the raw palette (`red.50…950`, `violet`, `emerald`, radii, spacing).
- **Semantic** — intent tokens that reference primitives (`primary`, `ai`, `content`, `state.*`,
  `radius`), split by `colorScheme` (light / dark).
- **Component** — per-component knobs that reference semantics (`chat.composerRadius`,
  `sidebar.fabBackground`).

Everything resolves to `--agt-*` CSS variables at runtime.

## Install

Usually pulled in automatically by `ng add @ng-agentic/core`. Standalone:

```bash
npm i @ng-agentic/themes
```

## Presets

- **`Base`** — light/dark, red→violet AI accent.
- **`Aurora`** — a noir, dark-first preset.

<p>
  <img src="https://raw.githubusercontent.com/aaronchacon/agentic/main/.github/media/theme-base.png" alt="Base preset — red-violet AI accent" width="49%" />
  <img src="https://raw.githubusercontent.com/aaronchacon/agentic/main/.github/media/theme-aurora.png" alt="Aurora preset — monochrome noir" width="49%" />
</p>

```ts
import { provideAgentic } from '@ng-agentic/core';
import { Aurora } from '@ng-agentic/themes';

provideAgentic({ theme: { preset: Aurora, darkModeSelector: '.dark' } });
```

## Build your own with `definePreset`

Merge overrides on top of any preset — deep-partial, type-safe:

```ts
import { Aurora, definePreset } from '@ng-agentic/themes';

export const Brand = definePreset(Aurora, {
  semantic: {
    radius: { lg: '20px' },
    colorScheme: {
      light: { ai: { color: '{red.700}' } },
      dark: { ai: { color: '{red.400}' } },
    },
  },
});
```

Use `{token.ref}` to reference other tokens (and `color-mix()` for derived values) instead of
hard-coding hex — the resolver expands them.

## Runtime restyling

Inject `AgenticThemeService` from `@ng-agentic/core` to swap presets, merge token overrides or
toggle dark mode after bootstrap:

```ts
const theme = inject(AgenticThemeService);
theme.setPreset(Aurora);
theme.updatePreset({ semantic: { colorScheme: { light: { ai: { color: '#059669' } } } } });
theme.toggleDarkMode();
```

## License

MIT © [Aaron Chacón](https://github.com/aaronchacon)
