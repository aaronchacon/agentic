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
import { createFixtureTransport } from '../../core/fixture-transport';
import { AgtChat } from '../chat/agt-chat';
import { AgtSidebar } from './agt-sidebar';

@Component({
  selector: 'agt-sidebar-demo',
  imports: [AgtSidebar, AgtChat],
  template: `
    <div class="demo-app">
      <p>Your app content — open the copilot from the button. →</p>
    </div>
    <agt-sidebar [(open)]="open" [title]="title" [badge]="badge">
      <agt-chat
        [store]="store"
        emptyTitle="Ask the KYC copilot"
        [suggestions]="['Why do you need this?', 'What documents are missing?']"
      />
    </agt-sidebar>
  `,
  styles: [
    `
      .demo-app {
        padding: 32px;
        color: var(--agt-content-muted-color, #64748b);
      }
    `,
  ],
})
class SidebarDemo implements OnInit {
  private readonly injector = inject(EnvironmentInjector);
  @Input() open = false;
  @Input() title = 'Copilot';
  @Input() badge: number | boolean = false;

  store!: AgentStore;

  ngOnInit(): void {
    this.store = runInInjectionContext(this.injector, () =>
      injectAgent({
        transport: createFixtureTransport(
          [
            { type: 'text', delta: 'We ask for this to verify your identity under KYC rules. ' },
            { type: 'text', delta: 'Your data is encrypted and only used for verification.' },
            { type: 'done' },
          ],
          { defaultDelayMs: 45 },
        ),
      }),
    );
  }
}

const meta: Meta<SidebarDemo> = {
  title: 'Components/Sidebar',
  component: SidebarDemo,
  decorators: [moduleMetadata({ imports: [AgtSidebar, AgtChat] })],
};
export default meta;

type Story = StoryObj<SidebarDemo>;

export const Closed: Story = {
  args: { open: false, title: 'KYC Copilot', badge: 2 },
};

export const Open: Story = {
  args: { open: true, title: 'KYC Copilot', badge: false },
};
