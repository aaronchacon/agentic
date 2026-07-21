import { Component, afterNextRender } from '@angular/core';
import {
  AgtChat,
  AgtSuggestion,
  AgtSummary,
  createFixtureTransport,
  injectAgent,
  type FixtureScript,
} from '@ng-agentic/core';
import { DocDemo } from '../ui/doc-demo/doc-demo';
import { injectT } from '../i18n/i18n';
import { PROVENANCE_I18N } from './provenance.page.i18n';

const chatReply: FixtureScript = [
  {
    type: 'reasoning',
    delta: 'Screening the case against sanctions and PEP lists.',
  },
  {
    type: 'text',
    delta: 'No sanctions or PEP hits — this case looks **clean**.',
  },
  { type: 'done' },
];

const summary = `**Low risk.** The passport was extracted with 98% confidence and the name matches the application exactly. No sanctions or PEP hits.

Recommendation: **approve** with a standard 12-month review.`;

@Component({
  imports: [DocDemo, AgtSummary, AgtSuggestion, AgtChat],
  templateUrl: './provenance.page.html',
})
export default class ProvenancePage {
  protected readonly t = injectT(PROVENANCE_I18N);

  protected readonly summary = summary;
  protected readonly suggestions = [
    'Summarize this case',
    'Any inconsistencies?',
  ];
  protected readonly store = injectAgent({
    transport: createFixtureTransport(chatReply, { defaultDelayMs: 45 }),
  });

  protected readonly summaryCode = `<agt-summary title="Case summary" [content]="summary" (regenerate)="regen()" />`;
  protected readonly suggestionCode = [
    `<agt-suggestion`,
    `  label="Full name"`,
    `  [suggestion]="'Ada Lovelace'"`,
    `  [confidence]="0.98"`,
    `  [(value)]="name"`,
    `  [(accepted)]="fromAi" />`,
  ].join('\n');
  protected readonly chatCode = `<agt-chat [store]="agent" [suggestions]="suggestions" />`;

  constructor() {
    afterNextRender(() => this.store.send('Summarize this case'));
  }
}
