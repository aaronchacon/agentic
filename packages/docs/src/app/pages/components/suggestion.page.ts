import { Component } from '@angular/core';
import { AgtSuggestion } from '@ng-agentic/core';
import { DocDemo } from '../../ui/doc-demo/doc-demo';
import { DocProps } from '../../ui/doc-props/doc-props';
import { propsToMarkdown } from '../../ui/doc-props/doc-props.util';
import type { DocProp } from '../../model/doc-prop.model';
import { DocMd } from '../../ui/doc-md/doc-md';

@Component({
  imports: [AgtSuggestion, DocDemo, DocProps, DocMd],
  templateUrl: './suggestion.page.html',
})
export default class SuggestionPage {
  protected readonly props: DocProp[] = [
    {
      name: 'label',
      type: 'string',
      default: "''",
      description: 'Field label.',
    },
    {
      name: 'suggestion',
      type: 'string | null',
      default: 'null',
      description: 'AI-suggested value, shown as ghost text.',
    },
    {
      name: 'confidence',
      type: 'number',
      description: 'Confidence 0–1, shown as a percentage badge.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: "''",
      description: 'Input placeholder text.',
    },
    {
      name: 'value',
      type: 'string',
      default: "''",
      description: 'The field value (two-way, [(value)]).',
    },
    {
      name: 'accepted',
      type: 'boolean',
      default: 'false',
      description: 'Whether the value came from the AI suggestion (two-way).',
    },
  ];

  protected readonly code = [
    `<agt-suggestion`,
    `  label="Full name"`,
    `  [suggestion]="'Ada Lovelace'"`,
    `  [confidence]="0.98"`,
    `  [(value)]="name"`,
    `  [(accepted)]="fromAi" />`,
  ].join('\n');

  protected get md(): string {
    return [
      '# Suggestion',
      '',
      'A form field with an AI suggestion shown as ghost text, with accept/reject controls and a confidence badge. Tracks provenance for compliance — suggested → accepted (AI) → edited by human.',
      '',
      '```html',
      this.code,
      '```',
      '',
      propsToMarkdown(this.props),
    ].join('\n');
  }
}
