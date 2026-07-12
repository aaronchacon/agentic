import { Component } from '@angular/core';
import {
  AgtChat,
  AgtSidebar,
  createFixtureTransport,
  injectAgent,
  type FixtureScript,
} from '@ng-agentic/core';
import { DocDemo } from '../../ui/doc-demo';
import { DocProps, propsToMarkdown, type DocProp } from '../../ui/doc-props';
import { DocMd } from '../../ui/doc-md';

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
  selector: 'docs-sidebar',
  imports: [AgtSidebar, AgtChat, DocDemo, DocProps, DocMd],
  template: `
    <article class="doc">
      <div class="doc__head">
        <p class="doc__eyebrow">Components</p>
        <h1 class="doc__title">Sidebar</h1>
        <p class="doc__lead">
          A collapsible agent side panel that wraps its content (e.g. the chat).
          When closed it shows a floating action button with an optional badge;
          when open it slides in a docked panel with managed focus and
          <code>inert</code>.
        </p>
        <doc-md [markdown]="md" />
      </div>

      <section class="doc__section">
        <h2>Agent panel</h2>
        <p>
          The launcher is fixed to the bottom-right of the page. Click it to
          slide in the panel — the FAB colour is themeable via
          <code>--agt-sidebar-fab-background</code>.
        </p>
        <doc-demo [code]="code">
          <div class="sidebar-hint">
            The agent launcher is at the bottom-right of the page → open it.
          </div>
        </doc-demo>
      </section>

      <section class="doc__section">
        <h2>API</h2>
        <doc-props [rows]="props" />
      </section>
    </article>

    <agt-sidebar title="KYC Agent" [badge]="2">
      <agt-chat
        [store]="store"
        emptyTitle="Ask the KYC agent"
        [suggestions]="suggestions"
      />
    </agt-sidebar>
  `,
  styles: [
    `
      .sidebar-hint {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 160px;
        color: var(--agt-content-muted-color, #64748b);
        font-size: 0.95rem;
      }
    `,
  ],
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
