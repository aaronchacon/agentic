import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
} from '@angular/core';
import {
  AgtChat,
  createFixtureTransport,
  injectAgent,
  type FixtureScript,
} from '@ng-agentic/core';
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
import { CHAT_I18N } from './chat.page.i18n';

const reply: FixtureScript = [
  {
    type: 'reasoning',
    delta:
      'Checking document authenticity, then screening sanctions and PEP lists.',
  },
  { type: 'text', delta: 'This case looks **solid**.\n\n' },
  {
    type: 'text',
    delta:
      '- Passport `98%` confidence, name matches\n- No sanctions or PEP hits\n\n',
  },
  {
    type: 'text',
    delta: 'Recommendation: **approve** with a 12-month review.',
  },
  { type: 'done' },
];

const BASE_PROPS: BaseProp<keyof (typeof CHAT_I18N)['en']['props']>[] = [
  { name: 'store', type: 'AgentStore', required: true },
  { name: 'suggestions', type: 'string[]', default: '[]' },
  { name: 'emptyTitle', type: 'string', default: "'What can I help with?'" },
  { name: 'placeholder', type: 'string', default: "'Ask anything'" },
  { name: 'ariaLabel', type: 'string', default: "'Message'" },
  { name: 'streamSpeed', type: 'StreamSpeed', default: "'smooth'" },
];

/** English rows for the copied markdown, which stays English (llms.txt parity). */
const PROPS_EN = withDescriptions(BASE_PROPS, CHAT_I18N.en.props);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgtChat, DocDemo, DocProps, DocMd],
  templateUrl: './chat.page.html',
})
export default class ChatPage {
  protected readonly t = injectT(CHAT_I18N);
  protected readonly props = computed<DocProp[]>(() =>
    withDescriptions(BASE_PROPS, this.t().props),
  );

  protected readonly suggestions = [
    'Summarize this case',
    'What documents are missing?',
  ];
  protected readonly store = injectAgent({
    transport: createFixtureTransport(reply, { defaultDelayMs: 45 }),
  });

  protected readonly code = [
    `import { Component } from '@angular/core';`,
    `import { AgtChat, injectAgent } from '@ng-agentic/core';`,
    ``,
    `@Component({`,
    `  imports: [AgtChat],`,
    `  template: \`<agt-chat [store]="agent" [suggestions]="suggestions" />\`,`,
    `})`,
    `export class CaseChat {`,
    `  readonly agent = injectAgent({ transport: mySseTransport });`,
    `  readonly suggestions = ['Summarize this case'];`,
    `}`,
  ].join('\n');

  // Built once — locale-independent (the copied markdown stays English).
  protected readonly md = [
    '# Chat',
    '',
    CHAT_I18N.en.lead,
    '',
    '```ts',
    this.code,
    '```',
    '',
    propsToMarkdown(PROPS_EN),
  ].join('\n');

  constructor() {
    afterNextRender(() => this.store.send('Summarize this case'));
  }
}
