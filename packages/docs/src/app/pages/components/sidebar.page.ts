import { Component } from '@angular/core';
import {
  AgtChat,
  AgtSidebar,
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
    type: 'text',
    delta: 'We ask for this to verify your identity under KYC rules. ',
  },
  {
    type: 'text',
    delta: 'Your data is encrypted and only used for verification.',
  },
  { type: 'done' },
];

@Component({
  imports: [AgtSidebar, AgtChat, DocDemo, DocProps, DocMd],
  templateUrl: './sidebar.page.html',
  styleUrl: './sidebar.page.scss',
})
export default class SidebarPage {
  protected readonly props: DocProp[] = [
    {
      name: 'open',
      type: 'boolean',
      default: 'false',
      description: 'Whether the panel is open (two-way, [(open)]).',
    },
    {
      name: 'title',
      type: 'string',
      default: "'Agent'",
      description: 'Panel header title.',
    },
    {
      name: 'side',
      type: "'right' | 'left'",
      default: "'right'",
      description: 'Which edge the panel docks to.',
    },
    {
      name: 'badge',
      type: 'number | boolean',
      default: 'false',
      description: 'Unread badge on the launcher (count or dot).',
    },
  ];

  protected readonly suggestions = [
    'Why do you need this?',
    'What documents are missing?',
  ];
  protected readonly store = injectAgent({
    transport: createFixtureTransport(reply, { defaultDelayMs: 45 }),
  });

  protected readonly code = [
    `<agt-sidebar [(open)]="open" title="Agent" [badge]="unread">`,
    `  <agt-chat [store]="agent" />`,
    `</agt-sidebar>`,
  ].join('\n');

  protected get md(): string {
    return [
      '# Sidebar',
      '',
      'A collapsible agent side panel that wraps its content (e.g. the chat). When closed it shows a floating action button with an optional badge; when open it slides in a docked panel with managed focus and `inert`.',
      '',
      '```html',
      this.code,
      '```',
      '',
      propsToMarkdown(this.props),
    ].join('\n');
  }
}
