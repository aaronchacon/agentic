import { Component } from '@angular/core';
import { AgtApproval } from '@ng-agentic/core';
import { DocDemo } from '../../ui/doc-demo/doc-demo';
import { DocProps } from '../../ui/doc-props/doc-props';
import { propsToMarkdown } from '../../ui/doc-props/doc-props.util';
import type { DocProp } from '../../model/doc-prop.model';
import { DocMd } from '../../ui/doc-md/doc-md';

@Component({
  imports: [AgtApproval, DocDemo, DocProps, DocMd],
  templateUrl: './approval.page.html',
})
export default class ApprovalPage {
  protected readonly props: DocProp[] = [
    {
      name: 'action',
      type: 'string',
      required: true,
      description: 'The action being gated, shown to the reviewer.',
    },
    {
      name: 'title',
      type: 'string',
      default: "'Approval required'",
      description: 'Card heading.',
    },
    {
      name: 'detail',
      type: 'unknown',
      description: 'Optional payload rendered as a JSON block.',
    },
    {
      name: 'editable',
      type: 'boolean',
      default: 'false',
      description: 'Show an Edit action alongside Approve / Reject.',
    },
    {
      name: 'state',
      type: "'pending' | 'approved' | 'rejected'",
      default: "'pending'",
      description: 'Current decision (two-way, [(state)]).',
    },
  ];

  protected readonly events: DocProp[] = [
    {
      name: 'approve',
      type: 'void',
      description: 'Emitted when the reviewer approves.',
    },
    {
      name: 'reject',
      type: 'void',
      description: 'Emitted when the reviewer rejects.',
    },
    {
      name: 'edit',
      type: 'void',
      description: 'Emitted when the Edit action is pressed (if editable).',
    },
  ];

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
      'A human-in-the-loop gate: the agent pauses and asks a person to approve, edit or reject an action before proceeding — non-negotiable in regulated flows. Resolves to an approved or rejected state.',
      '',
      '```html',
      this.code,
      '```',
      '',
      propsToMarkdown(this.props),
      '',
      propsToMarkdown(this.events, 'Event'),
    ].join('\n');
  }
}
