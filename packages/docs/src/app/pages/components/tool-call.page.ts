import { Component } from '@angular/core';
import { AgtToolCall, type ToolCall } from '@ng-agentic/core';
import { DocDemo } from '../../ui/doc-demo/doc-demo';
import { DocProps } from '../../ui/doc-props/doc-props';
import { propsToMarkdown } from '../../ui/doc-props/doc-props.util';
import type { DocProp } from '../../model/doc-prop.model';
import { DocMd } from '../../ui/doc-md/doc-md';

@Component({
  imports: [AgtToolCall, DocDemo, DocProps, DocMd],
  templateUrl: './tool-call.page.html',
})
export default class ToolCallPage {
  protected readonly props: DocProp[] = [
    {
      name: 'toolCall',
      type: 'ToolCall',
      required: true,
      description: 'The call to render: { id, name, status, detail? }.',
    },
    {
      name: 'steps',
      type: 'string[]',
      default: '[]',
      description: 'Sub-steps shown while running and on expand.',
    },
  ];

  protected readonly steps = [
    'Loading compliance rules',
    'Extracting fields',
    'Scoring risk',
  ];
  protected readonly running: ToolCall = {
    id: '1',
    name: 'verify_document',
    status: 'running',
  };
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
