import { Component, afterNextRender } from '@angular/core';
import {
  AgtChat,
  createFixtureTransport,
  injectAgent,
  type FixtureScript,
} from '@ng-agentic/core';
import { DocDemo } from '../../ui/doc-demo/doc-demo';
import { DocProps } from '../../ui/doc-props/doc-props';
import { propsToMarkdown } from '../../ui/doc-props/doc-props.util';
import type { DocProp } from '../../model/doc-prop.model';
import { DocMd } from '../../ui/doc-md/doc-md';

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

@Component({
  imports: [AgtChat, DocDemo, DocProps, DocMd],
  templateUrl: './chat.page.html',
})
export default class ChatPage {
  protected readonly props: DocProp[] = [
    {
      name: 'store',
      type: 'AgentStore',
      required: true,
      description: 'Agent store created with injectAgent().',
    },
    {
      name: 'suggestions',
      type: 'string[]',
      default: '[]',
      description: 'Prompt chips shown in the empty state.',
    },
    {
      name: 'emptyTitle',
      type: 'string',
      default: "'What can I help with?'",
      description: 'Title shown in the empty state.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: "'Ask anything'",
      description: 'Composer placeholder text.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      default: "'Message'",
      description: 'Accessible label for the composer.',
    },
    {
      name: 'streamSpeed',
      type: 'StreamSpeed',
      default: "'smooth'",
      description: "'instant' | 'slow' | 'smooth' | 'fast', or words/second.",
    },
  ];

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

  protected get md(): string {
    return [
      '# Chat',
      '',
      'A ChatGPT-style chat surface: streaming markdown with syntax-highlighted code blocks, a collapsible reasoning trace, a thinking indicator, an empty state with suggestions and an auto-growing composer.',
      '',
      '```ts',
      this.code,
      '```',
      '',
      propsToMarkdown(this.props),
    ].join('\n');
  }

  constructor() {
    afterNextRender(() => this.store.send('Summarize this case'));
  }
}
