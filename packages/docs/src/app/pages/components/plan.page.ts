import { Component } from '@angular/core';
import { AgtPlan, type PlanStep } from '@ng-agentic/core';
import { DocDemo } from '../../ui/doc-demo';
import { DocProps, propsToMarkdown, type DocProp } from '../../ui/doc-props';
import { DocMd } from '../../ui/doc-md';

@Component({
  selector: 'docs-plan',
  imports: [AgtPlan, DocDemo, DocProps, DocMd],
  template: `
    <article class="doc">
      <div class="doc__head">
        <p class="doc__eyebrow">Components</p>
        <h1 class="doc__title">Plan</h1>
        <p class="doc__lead">
          The agent's plan / execution-trace as a vertical timeline of steps —
          pending, active, done or error — with a progress summary in the
          header. Collapsible.
        </p>
        <doc-md [markdown]="md" />
      </div>

      <section class="doc__section">
        <h2>Timeline</h2>
        <doc-demo [code]="code">
          <div style="max-width: 520px; margin: 0 auto; width: 100%;">
            <agt-plan title="Verification" [steps]="steps" />
          </div>
        </doc-demo>
      </section>

      <section class="doc__section">
        <h2>API</h2>
        <doc-props [rows]="props" />
      </section>
    </article>
  `,
})
export default class PlanPage {
  protected readonly props: DocProp[] = [
    {
      name: 'steps',
      type: 'PlanStep[]',
      required: true,
      description: 'Ordered steps: { id, label, status }.',
    },
    {
      name: 'title',
      type: 'string',
      default: "'Plan'",
      description: 'Header title.',
    },
  ];

  protected readonly steps: PlanStep[] = [
    { id: '1', label: 'Extract document fields', status: 'done' },
    { id: '2', label: 'Match name against application', status: 'done' },
    { id: '3', label: 'Screen sanctions & PEP lists', status: 'active' },
    { id: '4', label: 'Compute risk score', status: 'pending' },
  ];

  protected readonly code = [
    `<agt-plan title="Verification" [steps]="agent.plan()" />`,
    ``,
    `// steps: { id, label, status: 'pending' | 'active' | 'done' | 'error' }[]`,
    `// fed from the store's step events`,
  ].join('\n');

  protected get md(): string {
    return [
      '# Plan',
      '',
      "The agent's plan / execution-trace as a vertical timeline of steps — pending, active, done or error — with a progress summary in the header. Collapsible.",
      '',
      '```html',
      this.code,
      '```',
      '',
      propsToMarkdown(this.props),
    ].join('\n');
  }
}
