import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AgtPlan } from './agt-plan';

const meta: Meta<AgtPlan> = {
  title: 'Components/Plan',
  component: AgtPlan,
  decorators: [moduleMetadata({ imports: [AgtPlan] })],
  render: (args) => ({
    props: args,
    template: `<div style="max-width: 520px; margin: 0 auto; padding: 32px;">
      <agt-plan [title]="title" [steps]="steps" />
    </div>`,
  }),
};
export default meta;

type Story = StoryObj<AgtPlan>;

export const InProgress: Story = {
  args: {
    title: 'Verification',
    steps: [
      { id: '1', label: 'Extract document fields', status: 'done' },
      { id: '2', label: 'Match name against application', status: 'done' },
      { id: '3', label: 'Screen sanctions & PEP lists', status: 'active' },
      { id: '4', label: 'Compute risk score', status: 'pending' },
    ],
  },
};

export const Completed: Story = {
  args: {
    title: 'Verification',
    steps: [
      { id: '1', label: 'Extract document fields', status: 'done' },
      { id: '2', label: 'Match name against application', status: 'done' },
      { id: '3', label: 'Screen sanctions & PEP lists', status: 'done' },
      { id: '4', label: 'Compute risk score', status: 'done' },
    ],
  },
};

export const WithError: Story = {
  args: {
    title: 'Verification',
    steps: [
      { id: '1', label: 'Extract document fields', status: 'done' },
      { id: '2', label: 'Match name against application', status: 'done' },
      { id: '3', label: 'Screen sanctions & PEP lists', status: 'error' },
      { id: '4', label: 'Compute risk score', status: 'pending' },
    ],
  },
};
