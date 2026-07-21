import { Component, computed } from '@angular/core';
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
import { injectT } from '../../i18n/i18n';
import { SIDEBAR_I18N } from './sidebar.page.i18n';

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

/** Prop rows minus descriptions; those live (localized) in sidebar.page.i18n.ts. */
const BASE_PROPS: Array<
  Omit<DocProp, 'description'> & {
    name: keyof (typeof SIDEBAR_I18N)['en']['props'];
  }
> = [
  { name: 'open', type: 'boolean', default: 'false' },
  { name: 'title', type: 'string', default: "'Agent'" },
  { name: 'side', type: "'right' | 'left'", default: "'right'" },
  { name: 'badge', type: 'number | boolean', default: 'false' },
];

/** English rows for the copied markdown, which stays English (llms.txt parity). */
const PROPS_EN: DocProp[] = BASE_PROPS.map((p) => ({
  ...p,
  description: SIDEBAR_I18N.en.props[p.name],
}));

@Component({
  imports: [AgtSidebar, AgtChat, DocDemo, DocProps, DocMd],
  templateUrl: './sidebar.page.html',
  styleUrl: './sidebar.page.scss',
})
export default class SidebarPage {
  protected readonly t = injectT(SIDEBAR_I18N);
  protected readonly props = computed<DocProp[]>(() =>
    BASE_PROPS.map((p) => ({ ...p, description: this.t().props[p.name] })),
  );

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
      SIDEBAR_I18N.en.lead,
      '',
      '```html',
      this.code,
      '```',
      '',
      propsToMarkdown(PROPS_EN),
    ].join('\n');
  }
}
