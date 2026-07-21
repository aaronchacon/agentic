import { Component, afterNextRender } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AgtChat,
  createFixtureTransport,
  injectAgent,
  type FixtureScript,
} from '@ng-agentic/core';
import { injectT } from '../i18n/i18n';
import { HOME_I18N } from './(home).page.i18n';

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
  protected readonly t = injectT(HOME_I18N);

  protected readonly suggestions = [
    'Summarize this case',
    'Any inconsistencies?',
  ];
  protected readonly store = injectAgent({
    transport: createFixtureTransport(reply, { defaultDelayMs: 42 }),
  });

  constructor() {
    afterNextRender(() => this.store.send('Summarize this case'));
  }
}
