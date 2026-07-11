import { Component } from '@angular/core';
import { AgtSuggestion } from '@aaronch/agentic';
import { DocDemo } from '../../ui/doc-demo';
import { DocProps, propsToMarkdown, type DocProp } from '../../ui/doc-props';
import { DocMd } from '../../ui/doc-md';

@Component({
  selector: 'docs-suggestion',
  imports: [AgtSuggestion, DocDemo, DocProps, DocMd],
  template: `
    <article class="doc">
      <div class="doc__head">
        <p class="doc__eyebrow">Components</p>
        <h1 class="doc__title">Suggestion</h1>
        <p class="doc__lead">
          A form field with an AI suggestion shown as ghost text, with
          accept/reject controls and a confidence badge. Tracks provenance for
          compliance —
          <strong>suggested → accepted (AI) → edited by human</strong>.
        </p>
        <doc-md [markdown]="md" />
      </div>

      <section class="doc__section">
        <h2>Provenance</h2>
        <p>
          Accept the suggestion (Tab), then edit the value to see it flip to
          "Edited by human".
        </p>
        <doc-demo [code]="code">
          <div
            style="display: flex; flex-direction: column; gap: 18px; max-width: 420px; margin: 0 auto; width: 100%;"
          >
            <agt-suggestion
              label="Full name"
              [suggestion]="'Ada Lovelace'"
              [confidence]="0.98"
              placeholder="Enter full name"
            />
            <agt-suggestion
              label="Nationality (accepted)"
              [suggestion]="'United Kingdom'"
              [confidence]="0.95"
              value="United Kingdom"
              [accepted]="true"
            />
            <agt-suggestion
              label="Date of birth (edited)"
              [suggestion]="'1815-12-10'"
              [confidence]="0.9"
              value="1815-12-11"
              [accepted]="true"
            />
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
