import { Component } from '@angular/core';
import { AgtSummary } from '@ng-agentic/core';
import { DocDemo } from '../../ui/doc-demo/doc-demo';
import { DocProps } from '../../ui/doc-props/doc-props';
import { propsToMarkdown } from '../../ui/doc-props/doc-props.util';
import type { DocProp } from '../../model/doc-prop.model';
import { DocMd } from '../../ui/doc-md/doc-md';

const summary = `**Low risk.** The passport was extracted with 98% confidence and the name matches the application exactly. The utility-bill address is consistent, with no sanctions or PEP hits.

- Document: passport (valid)
- Name match: exact
- Sanctions / PEP: none

Recommendation: **approve** with a standard 12-month review.`;

@Component({
  imports: [AgtSummary, DocDemo, DocProps, DocMd],
  templateUrl: './summary.page.html',
})
export default class SummaryPage {
  protected readonly props: DocProp[] = [
    {
      name: 'title',
      type: 'string',
      default: "''",
      description: 'Summary heading.',
    },
    {
      name: 'content',
      type: 'string',
      default: "''",
      description: 'Markdown content of the summary.',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'Shows a skeleton placeholder while true.',
    },
    {
      name: 'streaming',
      type: 'boolean',
      default: 'false',
      description: 'Reveal the content progressively.',
    },
    {
      name: 'streamSpeed',
      type: 'StreamSpeed',
      default: "'smooth'",
      description: "'instant' | 'slow' | 'smooth' | 'fast', or words/second.",
    },
  ];

  protected readonly events: DocProp[] = [
    {
      name: 'regenerate',
      type: 'void',
      description: 'Emitted when the regenerate button is pressed.',
    },
  ];

  protected readonly summary = summary;
  protected readonly code = `<agt-summary title="Case summary" [content]="summary" (regenerate)="regen()" />`;
  protected readonly loadingCode = `<agt-summary title="Case summary" [loading]="isGenerating()" />`;

  protected get md(): string {
    return [
      '# Summary',
      '',
      'A card for AI-generated summaries — clearly marked as AI content, with regenerate + copy actions and a skeleton while loading. Content renders as markdown and can stream in.',
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
