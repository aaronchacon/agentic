import { Component, computed } from '@angular/core';
import { AgtPlan, type PlanStep } from '@ng-agentic/core';
import { DocDemo } from '../../ui/doc-demo/doc-demo';
import { DocProps } from '../../ui/doc-props/doc-props';
import { propsToMarkdown } from '../../ui/doc-props/doc-props.util';
import type { DocProp } from '../../model/doc-prop.model';
import { DocMd } from '../../ui/doc-md/doc-md';
import { injectT } from '../../i18n/i18n';
import { PLAN_I18N } from './plan.page.i18n';

/** Prop rows minus descriptions; those live (localized) in plan.page.i18n.ts. */
const BASE_PROPS: Array<
  Omit<DocProp, 'description'> & {
    name: keyof (typeof PLAN_I18N)['en']['props'];
  }
> = [
  { name: 'steps', type: 'PlanStep[]', required: true },
  { name: 'title', type: 'string', default: "'Plan'" },
];

/** English rows for the copied markdown, which stays English (llms.txt parity). */
const PROPS_EN: DocProp[] = BASE_PROPS.map((p) => ({
  ...p,
  description: PLAN_I18N.en.props[p.name],
}));

@Component({
  imports: [AgtPlan, DocDemo, DocProps, DocMd],
  templateUrl: './plan.page.html',
})
export default class PlanPage {
  protected readonly t = injectT(PLAN_I18N);
  protected readonly props = computed<DocProp[]>(() =>
    BASE_PROPS.map((p) => ({ ...p, description: this.t().props[p.name] })),
  );

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
      PLAN_I18N.en.lead,
      '',
      '```html',
      this.code,
      '```',
      '',
      propsToMarkdown(PROPS_EN),
    ].join('\n');
  }
}
