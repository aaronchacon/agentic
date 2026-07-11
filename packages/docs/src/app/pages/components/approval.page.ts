import { Component } from '@angular/core';
import { AgtApproval } from '@aaronch/agentic';
import { DocDemo } from '../../ui/doc-demo';
import { DocProps, propsToMarkdown, type DocProp } from '../../ui/doc-props';
import { DocMd } from '../../ui/doc-md';

@Component({
  selector: 'docs-approval',
  imports: [AgtApproval, DocDemo, DocProps, DocMd],
  template: `
    <article class="doc">
      <div class="doc__head">
        <p class="doc__eyebrow">Components</p>
        <h1 class="doc__title">Approval</h1>
        <p class="doc__lead">
          A human-in-the-loop gate: the agent pauses and asks a person to approve, edit or reject an
          action before proceeding — non-negotiable in regulated flows. Resolves to an approved or
          rejected state.
        </p>
        <doc-md [markdown]="md" />
      </div>

      <section class="doc__section">
        <h2>Gate</h2>
        <p>Click Approve or Reject to resolve — the card records the decision.</p>
        <doc-demo [code]="code">
          <div style="max-width: 520px; margin: 0 auto; width: 100%;">
            <agt-approval
              title="Approval required"
              action="Auto-approve KYC case #4821 (low risk)."
              [detail]="detail"
              [editable]="true"
            />
          </div>
        </doc-demo>
      </section>

      <section class="doc__section">
        <h2>API</h2>
        <doc-props [rows]="props" />
        <doc-props nameHeader="Event" [rows]="events" />
      </section>
    </article>
  `,
})
export default class ApprovalPage {
  protected readonly props: DocProp[] = [
    { name: 'action', type: 'string', required: true, description: 'The action being gated, shown to the reviewer.' },
    { name: 'title', type: 'string', default: "'Approval required'", description: 'Card heading.' },
    { name: 'detail', type: 'unknown', description: 'Optional payload rendered as a JSON block.' },
    { name: 'editable', type: 'boolean', default: 'false', description: 'Show an Edit action alongside Approve / Reject.' },
    { name: 'state', type: "'pending' | 'approved' | 'rejected'", default: "'pending'", description: 'Current decision (two-way, [(state)]).' },
  ];

  protected readonly events: DocProp[] = [
    { name: 'approve', type: 'void', description: 'Emitted when the reviewer approves.' },
    { name: 'reject', type: 'void', description: 'Emitted when the reviewer rejects.' },
    { name: 'edit', type: 'void', description: 'Emitted when the Edit action is pressed (if editable).' },
  ];

  protected readonly detail = { risk: 'low', confidence: 0.98, sanctions: false, pep: false };

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
