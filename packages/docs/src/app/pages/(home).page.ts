import { Component, afterNextRender } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AgtChat,
  createFixtureTransport,
  injectAgent,
  type FixtureScript,
} from '@ng-agentic/core';
import type { Feature } from '../model/feature.model';

const reply: FixtureScript = [
  {
    type: 'reasoning',
    delta: 'Checking document authenticity and extraction confidence, ',
  },
  {
    type: 'reasoning',
    delta: 'then screening against sanctions and PEP lists.',
  },
  { type: 'text', delta: 'This case looks **solid**.\n\n' },
  { type: 'text', delta: '- Passport `98%` confidence, name matches\n' },
  { type: 'text', delta: '- No sanctions or PEP hits\n\n' },
  {
    type: 'text',
    delta: 'Recommendation: **approve** with a 12-month review.',
  },
  { type: 'done' },
];

@Component({
  imports: [RouterLink, AgtChat],
  templateUrl: './(home).page.html',
  styleUrl: './(home).page.scss',
})
export default class HomeComponent {
  protected readonly suggestions = [
    'Summarize this case',
    'Any inconsistencies?',
  ];
  protected readonly store = injectAgent({
    transport: createFixtureTransport(reply, { defaultDelayMs: 42 }),
  });

  protected readonly features: Feature[] = [
    {
      title: 'Human-in-the-loop, built in',
      body: 'Approval gates for actions that need a person: approve, edit or reject — with full state tracking, not a bolted-on confirm().',
    },
    {
      title: 'Provenance by default',
      body: 'Users always see what the AI wrote, suggested or summarized — one consistent visual language across chat, summaries and form fields.',
    },
    {
      title: 'Agentic, not just chat',
      body: "Tool-calling cards and execution-trace plans make the agent's work visible, step by step — not a black box.",
    },
    {
      title: 'Streaming, done right',
      body: 'Smooth markdown reveal with syntax-highlighted code, a collapsible reasoning trace and a live cursor.',
    },
    {
      title: 'Themeable by tokens',
      body: '3-layer design tokens (primitive → semantic → component), dark and light. Swap presets or restyle without forking CSS.',
    },
    {
      title: 'Accessible & headless',
      body: 'AA contrast, keyboard-first, dark mode. Bring your own transport via the AG-UI-compatible contract.',
    },
  ];

  constructor() {
    afterNextRender(() => this.store.send('Summarize this case'));
  }
}
