import { Component } from '@angular/core';
import { AgtPlan, type PlanStep } from '@ng-agentic/core';
import { DocDemo } from '../../ui/doc-demo/doc-demo';
import { DocProps } from '../../ui/doc-props/doc-props';
import { propsToMarkdown } from '../../ui/doc-props/doc-props.util';
import type { DocProp } from '../../model/doc-prop.model';
import { DocMd } from '../../ui/doc-md/doc-md';

@Component({
  imports: [AgtPlan, DocDemo, DocProps, DocMd],
  templateUrl: './plan.page.html',
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
