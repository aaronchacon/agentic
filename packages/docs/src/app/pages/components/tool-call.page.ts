import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { AgtToolCall, type ToolCall } from '@ng-agentic/core';
import { DocDemo } from '../../ui/doc-demo/doc-demo';
import { DocProps } from '../../ui/doc-props/doc-props';
import {
  propsToMarkdown,
  withDescriptions,
  type BaseProp,
} from '../../ui/doc-props/doc-props.util';
import type { DocProp } from '../../model/doc-prop.model';
import { DocMd } from '../../ui/doc-md/doc-md';
import { injectT } from '../../i18n/i18n';
import { TOOL_CALL_I18N } from './tool-call.page.i18n';

const BASE_PROPS: BaseProp<keyof (typeof TOOL_CALL_I18N)['en']['props']>[] = [
  { name: 'toolCall', type: 'ToolCall', required: true },
  { name: 'steps', type: 'string[]', default: '[]' },
];

/** English rows for the copied markdown, which stays English (llms.txt parity). */
const PROPS_EN = withDescriptions(BASE_PROPS, TOOL_CALL_I18N.en.props);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgtToolCall, DocDemo, DocProps, DocMd],
  templateUrl: './tool-call.page.html',
})
export default class ToolCallPage {
  protected readonly t = injectT(TOOL_CALL_I18N);
  protected readonly props = computed<DocProp[]>(() =>
    withDescriptions(BASE_PROPS, this.t().props),
  );

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

  // Built once — locale-independent (the copied markdown stays English).
  protected readonly md = [
    '# Tool Call',
    '',
    TOOL_CALL_I18N.en.lead,
    '',
    '```html',
    this.code,
    '```',
    '',
    propsToMarkdown(PROPS_EN),
  ].join('\n');
}
