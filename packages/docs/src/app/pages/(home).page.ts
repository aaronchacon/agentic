import { Component, afterNextRender } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AgtChat, createFixtureTransport, injectAgent, type FixtureScript } from '@aaronch/agentic';

const reply: FixtureScript = [
  { type: 'reasoning', delta: 'Checking document authenticity and extraction confidence, ' },
  { type: 'reasoning', delta: 'then screening against sanctions and PEP lists.' },
  { type: 'text', delta: 'This case looks **solid**.\n\n' },
  { type: 'text', delta: '- Passport `98%` confidence, name matches\n' },
  { type: 'text', delta: '- No sanctions or PEP hits\n\n' },
  { type: 'text', delta: 'Recommendation: **approve** with a 12-month review.' },
  { type: 'done' },
];

@Component({
  selector: 'docs-home',
  imports: [RouterLink, AgtChat],
  template: `
    <div class="page">
      <div class="glow" aria-hidden="true"></div>

      <section class="hero">
        <div class="hero__copy">
          <span class="hero__eyebrow">Angular 21 · signals · AG-UI compatible</span>
          <h1 class="hero__title">
            The <span class="grad">agent-experience</span> UI layer for Angular
          </h1>
          <p class="hero__lead">
            Production-grade components for AI &amp; agent interfaces — streaming chat, tool-calling,
            reasoning, plans and human-in-the-loop approvals. Themeable design tokens, accessible, zero
            backend lock-in.
          </p>
          <div class="hero__actions">
            <a class="btn btn--primary" routerLink="/components/chat">Get started →</a>
            <a class="btn btn--ghost" href="https://github.com/aaronchacon" target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          </div>
          <code class="hero__install">npm i &#64;aaronch/agentic &#64;aaronch/agentic-themes</code>
        </div>

        <div class="hero__demo">
          <div class="hero__window">
            <div class="hero__bar" aria-hidden="true"><span></span><span></span><span></span></div>
            <div class="hero__frame">
              <agt-chat [store]="store" emptyTitle="Ask the KYC agent" [suggestions]="suggestions" />
            </div>
          </div>
        </div>
      </section>

      <section class="features">
        @for (f of features; track f.title) {
          <div class="feature">
            <div class="feature__icon" aria-hidden="true"></div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.body }}</p>
          </div>
        }
      </section>

      <footer class="footer">
        Built by
        <a href="https://aaronch.dev" target="_blank" rel="noreferrer">Aaron Chacón</a>
        · MIT licensed ·
        <a href="https://github.com/aaronchacon" target="_blank" rel="noreferrer">Source on GitHub</a>
      </footer>
    </div>
  `,
  styleUrl: './home.css',
})
export default class HomeComponent {
  protected readonly suggestions = ['Summarize this case', 'Any inconsistencies?'];
  protected readonly store = injectAgent({
    transport: createFixtureTransport(reply, { defaultDelayMs: 42 }),
  });

  protected readonly features = [
    { title: 'Streaming, done right', body: 'Smooth, controllable markdown reveal with syntax-highlighted code, reasoning traces and a live cursor.' },
    { title: 'Themeable by tokens', body: '3-layer design tokens (primitive → semantic → component). Swap presets or restyle without forking.' },
    { title: 'Agentic, not just chat', body: 'Tool-calling cards, execution-trace plans and human-in-the-loop approval gates — built for regulated flows.' },
    { title: 'Accessible & headless', body: 'axe-clean, keyboard-first, dark mode. Bring your own transport via the AG-UI-compatible contract.' },
  ];

  constructor() {
    afterNextRender(() => this.store.send('Summarize this case'));
  }
}
