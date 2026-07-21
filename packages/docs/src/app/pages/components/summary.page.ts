import { Component, computed } from '@angular/core';
import { AgtSummary } from '@ng-agentic/core';
import { DocDemo } from '../../ui/doc-demo/doc-demo';
import { DocProps } from '../../ui/doc-props/doc-props';
import { propsToMarkdown } from '../../ui/doc-props/doc-props.util';
import type { DocProp } from '../../model/doc-prop.model';
import { DocMd } from '../../ui/doc-md/doc-md';
import { injectT } from '../../i18n/i18n';
import { SUMMARY_I18N } from './summary.page.i18n';

const summary = `**Low risk.** The passport was extracted with 98% confidence and the name matches the application exactly. The utility-bill address is consistent, with no sanctions or PEP hits.

- Document: passport (valid)
- Name match: exact
- Sanctions / PEP: none

Recommendation: **approve** with a standard 12-month review.`;

/** Prop rows minus descriptions; those live (localized) in summary.page.i18n.ts. */
const BASE_PROPS: Array<
  Omit<DocProp, 'description'> & {
    name: keyof (typeof SUMMARY_I18N)['en']['props'];
  }
> = [
  { name: 'title', type: 'string', default: "''" },
  { name: 'content', type: 'string', default: "''" },
  { name: 'loading', type: 'boolean', default: 'false' },
  { name: 'streaming', type: 'boolean', default: 'false' },
  { name: 'streamSpeed', type: 'StreamSpeed', default: "'smooth'" },
];

const BASE_EVENTS: Array<
  Omit<DocProp, 'description'> & {
    name: keyof (typeof SUMMARY_I18N)['en']['events'];
  }
> = [{ name: 'regenerate', type: 'void' }];

/** English rows for the copied markdown, which stays English (llms.txt parity). */
const PROPS_EN: DocProp[] = BASE_PROPS.map((p) => ({
  ...p,
  description: SUMMARY_I18N.en.props[p.name],
}));

const EVENTS_EN: DocProp[] = BASE_EVENTS.map((p) => ({
  ...p,
  description: SUMMARY_I18N.en.events[p.name],
}));

@Component({
  imports: [AgtSummary, DocDemo, DocProps, DocMd],
  templateUrl: './summary.page.html',
})
export default class SummaryPage {
  protected readonly t = injectT(SUMMARY_I18N);
  protected readonly props = computed<DocProp[]>(() =>
    BASE_PROPS.map((p) => ({ ...p, description: this.t().props[p.name] })),
  );
  protected readonly events = computed<DocProp[]>(() =>
    BASE_EVENTS.map((p) => ({ ...p, description: this.t().events[p.name] })),
  );

  protected readonly summary = summary;
  protected readonly code = `<agt-summary title="Case summary" [content]="summary" (regenerate)="regen()" />`;
  protected readonly loadingCode = `<agt-summary title="Case summary" [loading]="isGenerating()" />`;

  protected get md(): string {
    return [
      '# Summary',
      '',
      SUMMARY_I18N.en.lead,
      '',
      '```html',
      this.code,
      '```',
      '',
      propsToMarkdown(PROPS_EN),
      '',
      propsToMarkdown(EVENTS_EN, 'Event'),
    ].join('\n');
  }
}
