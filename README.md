# agentic

**The agent-experience UI layer for Angular.** Production-grade components for building AI &
agent interfaces — streaming chat, tool-calling, reasoning, execution plans and
human-in-the-loop approvals. Themeable design tokens, accessible, and backend-agnostic through an
[AG-UI](https://github.com/ag-ui-protocol/ag-ui)-compatible event contract.

![Angular](https://img.shields.io/badge/Angular-21-dd0031?logo=angular&logoColor=white)
![Signals](https://img.shields.io/badge/signals-zoneless-8514f5)
![License: MIT](https://img.shields.io/badge/License-MIT-informational)
![Status](https://img.shields.io/badge/status-v0.1%20pre--release-f11653)

> It's a component library (installed from npm, PrimeNG-style) — not a copy-paste snippet kit. The
> library never talks to an LLM: you connect your own transport (SSE / WebSocket / fixtures) that
> emits `AgentEvent`s, and the kit renders them.

<!-- TODO: hero.gif — streaming chat + tool-call + approval. Live demos: <deployed docs URL> -->

## Why

Angular has no first-class toolkit for agent UIs. Most options are React-first, chat-only, or force
you to hand-roll streaming, markdown, code highlighting, reasoning traces and provenance. `agentic`
gives you those as **standalone, signal-based, OnPush** components that are accessible (a11y AA),
dark-mode aware, and restyle-able without forking CSS.

- **Streaming, done right** — smooth, controllable markdown reveal with syntax-highlighted code, a
  live cursor, and a collapsible reasoning trace.
- **Agentic, not just chat** — tool-calling cards, execution-trace plans, and human-in-the-loop
  approval gates as first-class components. Built for regulated flows.
- **Themeable by tokens** — a 3-layer design-token system (primitive → semantic → component) with
  swappable presets and runtime restyling. No CSS forking.
- **Backend-agnostic** — connect any transport via a small, AG-UI-compatible event contract. Ships
  with `createFixtureTransport` for demos and tests with no API key.

## Install

```bash
ng add @aaronch/agentic
```

`ng add` installs `@aaronch/agentic-themes` and wires `provideAgentic()` into your app config for
you. Prefer to do it by hand?

```bash
npm i @aaronch/agentic @aaronch/agentic-themes
```

Requires Angular 21+ (standalone, zoneless-friendly signals).

## Quickstart

```ts
// app.config.ts
import { provideAgentic } from '@aaronch/agentic';

export const appConfig = {
  providers: [provideAgentic({ theme: { darkModeSelector: '.dark' } })],
};
```

```ts
// case-chat.component.ts
import { Component } from '@angular/core';
import { AgtChat, injectAgent } from '@aaronch/agentic';

@Component({
  selector: 'case-chat',
  imports: [AgtChat],
  template: `<agt-chat [store]="agent" [suggestions]="suggestions" />`,
})
export class CaseChat {
  // Bring your own transport (SSE/WebSocket) — or replay a script for demos.
  readonly agent = injectAgent({ transport: mySseTransport });
  readonly suggestions = ['Summarize this case', 'Any inconsistencies?'];
}
```

`injectAgent` returns a signal store you can read anywhere:

```ts
agent.messages(); // AgentMessage[]
agent.isRunning(); // boolean
agent.plan(); // PlanStep[]
agent.pendingApproval(); // ApprovalRequest | null
agent.send('Summarize this case');
agent.approve(id);
```

## Components

| Component          | What it is                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `<agt-chat>`       | ChatGPT-style chat — streaming markdown, code + copy, reasoning trace, empty state, composer.  |
| `<agt-tool-call>`  | Tool invocation card — running (spinner + steps), success (JSON result) or error.              |
| `<agt-suggestion>` | AI form suggestion as ghost text with accept/reject, confidence, and provenance tracking.      |
| `<agt-summary>`    | AI-generated summary card — marked as AI content, with regenerate/copy and a loading skeleton. |
| `<agt-sidebar>`    | Collapsible agent side panel with a floating launcher and unread badge (focus + `inert`).      |
| `<agt-plan>`       | Agent execution-trace as a vertical timeline (pending / active / done / error).                |
| `<agt-approval>`   | Human-in-the-loop gate — approve, edit or reject an action before the agent proceeds.          |

## The contract (AG-UI compatible)

The consumer connects a transport; the library only renders. The event stream is a small,
AG-UI-compatible subset:

<!-- prettier-ignore -->
```ts
type AgentEvent =
  | { type: 'reasoning'; delta: string }
  | { type: 'text'; delta: string }
  | { type: 'tool_call'; id: string; name: string; status: 'running' | 'success' | 'error'; detail?: unknown }
  | { type: 'step'; id: string; label: string; status: 'pending' | 'active' | 'done' | 'error' }
  | { type: 'approval_request'; id: string; action: string; payload?: unknown }
  | { type: 'done' }
  | { type: 'error'; message: string };

interface AgentTransport {
  run(input: AgentInput): Observable<AgentEvent>;
}
```

For demos and tests without a backend, `createFixtureTransport(script)` replays a recorded sequence
with configurable delays, and pauses on `approval_request` until you respond.

## Theming

Tokens compile to CSS custom properties across three layers — **primitive → semantic → component** —
so changing one value cascades everywhere. Swap a preset or override any token; nothing forks.

```ts
import { provideAgentic } from '@aaronch/agentic';
import { Aurora, definePreset } from '@aaronch/agentic-themes';

// A built-in preset (Base = Angular red→violet accent; Aurora = PrimeNG-Aura-style noir)...
provideAgentic({ theme: { preset: Aurora, darkModeSelector: '.dark' } });

// ...or your own brand, merged on top of one:
const Brand = definePreset(Aurora, {
  semantic: { colorScheme: { light: { ai: { color: '#e11d48' } } } },
});
```

Restyle at runtime with `AgenticThemeService` (`setPreset`, `updatePreset`, `toggleDarkMode`) — the
docs site's theming playground recolors the entire page live to prove it.

## Accessibility

Keyboard-first, `role`/`aria-live`/`inert` where it matters, focus management in the sidebar,
`prefers-reduced-motion` honored, and AA-contrast defaults. Storybook runs the axe addon on every
story.

## How it compares

|                                        | `agentic`      | CopilotKit      | Deep Chat        | Angular Material / PrimeNG |
| -------------------------------------- | -------------- | --------------- | ---------------- | -------------------------- |
| Angular-native (signals, standalone)   | ✅             | ⚠️ React-first  | ⚠️ web component | ✅                         |
| Agentic (tool-calls, plans, approvals) | ✅ first-class | ✅              | ❌ chat-only     | ❌                         |
| Backend-agnostic transport             | ✅ AG-UI       | tied to runtime | ✅               | n/a                        |
| Design-token theming                   | ✅ 3-layer     | limited         | limited          | ✅                         |

Honest take: use CopilotKit if you're on React; use Material/PrimeNG for general UI. `agentic` is
for **Angular teams building agent experiences** who want the AI-specific pieces without hand-rolling
them.

## Documentation

- **Docs site** (Analog.js) — live component demos, API tables, and a theming playground.
- **Storybook** — every component and state, with the a11y addon.
- **`/llms.txt`** — the docs as plain text for LLMs ([llmstxt.org](https://llmstxt.org)).

## Local development

```bash
pnpm install
pnpm verify        # format:check + lint + typecheck + test
pnpm test          # 57 unit tests (Vitest)
pnpm nx serve docs # run the docs site
pnpm nx storybook agentic
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org) (enforced by
commitlint); staged files are auto-formatted and linted via Husky + lint-staged.

## License

MIT © [Aaron Chacón](https://github.com/aaronchacon)
