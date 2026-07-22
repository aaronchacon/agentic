# agentic

**Agent UI your compliance team can sign off on.** Production-grade Angular components for AI &
agent interfaces — streaming chat, visible tool-calling, execution plans, human-in-the-loop
approvals and AI provenance. Themeable design tokens, accessible (a11y AA), and backend-agnostic
through an [AG-UI](https://github.com/ag-ui-protocol/ag-ui)-compatible event contract. Built for
teams putting AI into regulated products.

![Angular](https://img.shields.io/badge/Angular-21-dd0031?logo=angular&logoColor=white)
![Signals](https://img.shields.io/badge/signals-zoneless-8514f5)
![License: MIT](https://img.shields.io/badge/License-MIT-informational)
![Status](https://img.shields.io/badge/status-v0.1%20pre--release-f11653)

> It's a proper component library — installed from npm, themed by design tokens — not a copy-paste snippet kit. The
> library never talks to an LLM: you connect your own transport (SSE / WebSocket / fixtures) that
> emits `AgentEvent`s, and the kit renders them.

![agt-chat streaming a reply with a collapsible reasoning trace](https://raw.githubusercontent.com/aaronchacon/agentic/main/.github/media/chat.gif)

<!-- TODO: hero.gif — streaming chat + tool-call + approval. Live demos: <deployed docs URL> -->

## Built for regulated products

In regulated domains — fintech, KYC, legal, health — AI features carry three extra expectations,
and `agentic` treats them as first-class instead of edge cases:

- **A human can intervene** — `<agt-approval>` gates any action behind approve / edit / reject.
- **AI content is distinguishable from human content** — one consistent AI accent and provenance
  labelling across chat, summaries and form fields.
- **Decisions are traceable** — visible tool-call cards and execution-trace plans, step by step.

> agentic gives you the UI building blocks — compliance itself is your product's job.

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
ng add @ng-agentic/core
```

`ng add` installs `@ng-agentic/themes` and wires `provideAgentic()` into your app config for
you. Prefer to do it by hand?

```bash
npm i @ng-agentic/core @ng-agentic/themes
```

Requires Angular 21+ (standalone, zoneless-friendly signals).

## Quickstart

```ts
// app.config.ts
import { provideAgentic } from '@ng-agentic/core';

export const appConfig = {
  providers: [provideAgentic({ theme: { darkModeSelector: '.dark' } })],
};
```

```ts
// case-chat.component.ts
import { Component } from '@angular/core';
import { AgtChat, injectAgent } from '@ng-agentic/core';

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
| `<agt-chat>`       | Full chat surface — streaming markdown, code + copy, reasoning trace, empty state, composer.   |
| `<agt-tool-call>`  | Tool invocation card — running (spinner + steps), success (JSON result) or error.              |
| `<agt-suggestion>` | AI form suggestion as ghost text with accept/reject, confidence, and provenance tracking.      |
| `<agt-summary>`    | AI-generated summary card — marked as AI content, with regenerate/copy and a loading skeleton. |
| `<agt-sidebar>`    | Collapsible agent side panel with a floating launcher and unread badge (focus + `inert`).      |
| `<agt-plan>`       | Agent execution-trace as a vertical timeline (pending / active / done / error).                |
| `<agt-approval>`   | Human-in-the-loop gate — approve, edit or reject an action before the agent proceeds.          |

![agt-tool-call in its three states: running with steps, completed with a JSON result, and error](https://raw.githubusercontent.com/aaronchacon/agentic/main/.github/media/tool-call.gif)

<p>
  <img src="https://raw.githubusercontent.com/aaronchacon/agentic/main/.github/media/plan.gif" alt="agt-plan execution timeline with done, active and pending steps" width="49%" />
  <img src="https://raw.githubusercontent.com/aaronchacon/agentic/main/.github/media/approval.png" alt="agt-approval human-in-the-loop gate with approve, edit and reject actions" width="49%" />
</p>

## See it in a real product

[**KYC Vetted**](https://aaronchacon.github.io/kyc-vetted/) — an AI-assisted KYC onboarding demo built entirely on these components, installed from npm: document extraction with a visible plan, per-field AI suggestions with provenance, and a human approval gate in a compliance console. [Source](https://github.com/aaronchacon/kyc-vetted).

![KYC Vetted demo](https://raw.githubusercontent.com/aaronchacon/kyc-vetted/main/.github/media/demo.gif)

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
import { provideAgentic } from '@ng-agentic/core';
import { Aurora, definePreset } from '@ng-agentic/themes';

// A built-in preset (Base = red→violet accent; Aurora = noir, dark-first)...
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
