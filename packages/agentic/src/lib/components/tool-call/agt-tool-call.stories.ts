import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AgtToolCall } from './agt-tool-call';

const meta: Meta<AgtToolCall> = {
  title: 'Components/Tool Call',
  component: AgtToolCall,
  decorators: [moduleMetadata({ imports: [AgtToolCall] })],
  render: (args) => ({
    props: args,
    template: `<div style="max-width: 640px; margin: 0 auto; padding: 24px;">
      <agt-tool-call [toolCall]="toolCall" [steps]="steps" />
    </div>`,
  }),
};
export default meta;

type Story = StoryObj<AgtToolCall>;

export const Running: Story = {
  args: {
    toolCall: { id: '1', name: 'verify_document', status: 'running' },
    steps: [
      'Loading compliance rules',
      'Extracting document fields',
      'Scoring risk',
    ],
  },
};

export const Success: Story = {
  args: {
    toolCall: {
      id: '2',
      name: 'verify_document',
      status: 'success',
      detail: { risk: 'low', sanctions: false, pep: false, confidence: 0.98 },
    },
  },
};

export const Errored: Story = {
  args: {
    toolCall: {
      id: '3',
      name: 'screen_sanctions',
      status: 'error',
      detail:
        'Timeout contacting the sanctions provider (HTTP 503). Retry recommended.',
    },
  },
};
