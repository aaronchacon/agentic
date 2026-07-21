import { Component, computed } from '@angular/core';
import { AgtApproval } from '@ng-agentic/core';
import { DocDemo } from '../../ui/doc-demo/doc-demo';
import { DocProps } from '../../ui/doc-props/doc-props';
import { propsToMarkdown } from '../../ui/doc-props/doc-props.util';
import type { DocProp } from '../../model/doc-prop.model';
import { DocMd } from '../../ui/doc-md/doc-md';
import { injectT } from '../../i18n/i18n';
import { APPROVAL_I18N } from './approval.page.i18n';

/** Prop rows minus descriptions; those live (localized) in approval.page.i18n.ts. */
const BASE_PROPS: Array<
  Omit<DocProp, 'description'> & {
    name: keyof (typeof APPROVAL_I18N)['en']['props'];
  }
> = [
  { name: 'action', type: 'string', required: true },
  { name: 'title', type: 'string', default: "'Approval required'" },
  { name: 'detail', type: 'unknown' },
  { name: 'editable', type: 'boolean', default: 'false' },
  {
    name: 'state',
    type: "'pending' | 'approved' | 'rejected'",
    default: "'pending'",
  },
];

const BASE_EVENTS: Array<
  Omit<DocProp, 'description'> & {
    name: keyof (typeof APPROVAL_I18N)['en']['events'];
  }
> = [
  { name: 'approve', type: 'void' },
  { name: 'reject', type: 'void' },
  { name: 'edit', type: 'void' },
];

/** English rows for the copied markdown, which stays English (llms.txt parity). */
const PROPS_EN: DocProp[] = BASE_PROPS.map((p) => ({
  ...p,
  description: APPROVAL_I18N.en.props[p.name],
}));

const EVENTS_EN: DocProp[] = BASE_EVENTS.map((p) => ({
  ...p,
  description: APPROVAL_I18N.en.events[p.name],
}));

@Component({
  imports: [AgtApproval, DocDemo, DocProps, DocMd],
  templateUrl: './approval.page.html',
})
export default class ApprovalPage {
  protected readonly t = injectT(APPROVAL_I18N);
  protected readonly props = computed<DocProp[]>(() =>
    BASE_PROPS.map((p) => ({ ...p, description: this.t().props[p.name] })),
  );
  protected readonly events = computed<DocProp[]>(() =>
    BASE_EVENTS.map((p) => ({ ...p, description: this.t().events[p.name] })),
  );

  protected readonly detail = {
    risk: 'low',
    confidence: 0.98,
    sanctions: false,
    pep: false,
  };

  protected readonly code = [
    `<agt-approval`,
    `  action="Auto-approve KYC case #4821 (low risk)."`,
    `  [detail]="payload"`,
    `  (approve)="agent.approve(id)"`,
    `  (reject)="agent.reject(id)" />`,
  ].join('\n');

  protected get md(): string {
    return [
      '# Approval',
      '',
      APPROVAL_I18N.en.lead,
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
