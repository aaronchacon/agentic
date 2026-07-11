import { Component } from '@angular/core';
import { AgtToolCall, type ToolCall } from '@aaronch/agentic';
import { DocDemo } from '../../ui/doc-demo';
import { DocProps, propsToMarkdown, type DocProp } from '../../ui/doc-props';
import { DocMd } from '../../ui/doc-md';

@Component({
  selector: 'docs-tool-call',
  imports: [AgtToolCall, DocDemo, DocProps, DocMd],
  template: `
    <article class="doc">
      <div class="doc__head">
        <p class="doc__eyebrow">Components</p>
        <h1 class="doc__title">Tool Call</h1>
        <p class="doc__lead">
          An in-conversation card that visualizes a tool invocation — running (spinner + optional
          steps), success (green, with the result) or error (with the detail). The result renders as a
          syntax-highlighted JSON block.
        </p>
        <doc-md [markdown]="md" />
      </div>

      <section class="doc__section">
        <h2>States</h2>
        <doc-demo [code]="code">
          <div style="display: flex; flex-direction: column; gap: 12px; max-width: 520px; margin: 0 auto; width: 100%;">
            <agt-tool-call [toolCall]="running" [steps]="steps" />
            <agt-tool-call [toolCall]="success" />
            <agt-tool-call [toolCall]="errored" />
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
export default class ToolCallPage {
  protected readonly props: DocProp[] = [
    { name: 'toolCall', type: 'ToolCall', required: true, description: 'The call to render: { id, name, status, detail? }.' },
    { name: 'steps', type: 'string[]', default: '[]', description: 'Sub-steps shown while running and on expand.' },
  ];

  protected readonly steps = ['Loading compliance rules', 'Extracting fields', 'Scoring risk'];
  protected readonly running: ToolCall = { id: '1', name: 'verify_document', status: 'running' };
  protected readonly success: ToolCall = {
    id: '2',
    name: 'verify_document',
    status: 'success',
    detail: { risk: 'low', confidence: 0.98, sanctions: false },
  };
  protected readonly errored: ToolCall = {
    id: '3',
    name: 'screen_sanctions',
    status: 'error',
    detail: 'Timeout contacting the sanctions provider (HTTP 503).',
  };

  protected readonly code = [
    `<agt-tool-call [toolCall]="toolCall" [steps]="steps" />`,
    ``,
    `// toolCall: { id, name, status: 'running' | 'success' | 'error', detail? }`,
    `// fed from the store's tool_call events (agent.toolCalls())`,
  ].join('\n');

  protected get md(): string {
    return [
      '# Tool Call',
      '',
      'An in-conversation card that visualizes a tool invocation — running (spinner + optional steps), success (with the result) or error (with the detail). The result renders as a syntax-highlighted JSON block.',
      '',
      '```html',
      this.code,
      '```',
      '',
      propsToMarkdown(this.props),
    ].join('\n');
  }
}
