import {
  Component,
  EnvironmentInjector,
  Input,
  OnInit,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { injectAgent, type AgentStore } from '../../core/agent-store';
import { createFixtureTransport, type FixtureScript } from '../../core/fixture-transport';
import { AgtChat } from './agt-chat';
import type { StreamSpeed } from './agt-stream-text';

/**
 * Story host: builds an agent store from a fixture script and (optionally) seeds
 * an initial user message so the streaming reply plays automatically.
 */
@Component({
  selector: 'agt-chat-demo',
  imports: [AgtChat],
  template: `
    <div class="demo-frame">
      @if (store) {
        <agt-chat
          [store]="store"
          [suggestions]="suggestions"
          [emptyTitle]="emptyTitle"
          [streamSpeed]="streamSpeed"
        />
      }
    </div>
  `,
  styles: [
    `
      .demo-frame {
        height: 560px;
        max-width: 860px;
        margin: 0 auto;
        overflow: hidden;
        border: 1px solid var(--agt-content-border-color, #e2e8f0);
        border-radius: var(--agt-radius-lg, 12px);
        box-shadow: 0 12px 40px -16px rgba(15, 23, 42, 0.25);
      }
    `,
  ],
})
class ChatDemo implements OnInit {
  private readonly injector = inject(EnvironmentInjector);

  @Input() script: FixtureScript = [];
  @Input() suggestions: string[] = [];
  @Input() emptyTitle = 'How can I help?';
  @Input() streamSpeed: StreamSpeed = 'smooth';
  @Input() seed?: string;

  store!: AgentStore;

  ngOnInit(): void {
    this.store = runInInjectionContext(this.injector, () =>
      injectAgent({ transport: createFixtureTransport(this.script, { defaultDelayMs: 55 }) }),
    );
    if (this.seed) {
      const seed = this.seed;
      queueMicrotask(() => this.store.send(seed));
    }
  }
}

const reply: FixtureScript = [
  { type: 'text', delta: 'This case looks **solid**. Key findings:\n\n' },
  { type: 'text', delta: '- Passport extracted with `98%` confidence\n' },
  { type: 'text', delta: '- Full name matches the application exactly\n' },
  { type: 'text', delta: '- No sanctions or PEP hits\n\n' },
  { type: 'text', delta: 'Suggested auto-approval rule:\n\n' },
  { type: 'text', delta: '```ts\nif (score >= 0.9 && !sanctions) {\n  approve(caseId);\n}\n```\n\n' },
  { type: 'text', delta: 'Recommendation: **approve** with a periodic review in 12 months.' },
  { type: 'done' },
];

const meta: Meta<ChatDemo> = {
  title: 'Components/Chat',
  component: ChatDemo,
  argTypes: {
    streamSpeed: {
      control: 'select',
      options: ['instant', 'slow', 'smooth', 'fast'],
      description: 'How fast streamed text is revealed (or a number in words/second).',
    },
    seed: { control: 'text' },
  },
  decorators: [moduleMetadata({ imports: [AgtChat] })],
};
export default meta;

type Story = StoryObj<ChatDemo>;

export const EmptyWithSuggestions: Story = {
  args: {
    emptyTitle: 'Ask the KYC agent',
    suggestions: ['Summarize this case', 'What documents are missing?', 'Any inconsistencies?'],
    streamSpeed: 'smooth',
    script: reply,
  },
};

export const Streaming: Story = {
  args: {
    seed: 'Summarize this case',
    streamSpeed: 'smooth',
    script: reply,
  },
};

export const Reasoning: Story = {
  args: {
    seed: 'Review this KYC case',
    streamSpeed: 'smooth',
    script: [
      { type: 'reasoning', delta: 'Let me review this case step by step. ' },
      { type: 'reasoning', delta: 'First, check document authenticity and extraction confidence. ' },
      { type: 'reasoning', delta: 'The passport OCR is 98% and the name matches the application. ' },
      { type: 'reasoning', delta: 'Next, screen against sanctions and PEP lists — no hits found. ' },
      { type: 'reasoning', delta: 'Finally, weigh the overall risk: low.' },
      { type: 'text', delta: 'This case looks **solid**.\n\n' },
      { type: 'text', delta: '- Passport `98%` confidence, name matches\n' },
      { type: 'text', delta: '- No sanctions or PEP hits\n\n' },
      { type: 'text', delta: 'Recommendation: **approve** with a 12-month review.' },
      { type: 'done' },
    ],
  },
};

export const RateLimited: Story = {
  args: {
    seed: 'Summarize this case',
    streamSpeed: 'smooth',
    script: [
      { type: 'text', delta: 'Working on it… ' },
      { type: 'error', message: 'Rate limit reached. Please retry in 20s.' },
    ],
  },
};
