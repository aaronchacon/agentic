import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AgtApproval } from './agt-approval';

const meta: Meta<AgtApproval> = {
  title: 'Components/Approval',
  component: AgtApproval,
  decorators: [moduleMetadata({ imports: [AgtApproval] })],
  render: (args) => ({
    props: args,
    template: `<div style="max-width: 520px; margin: 0 auto; padding: 32px;">
      <agt-approval
        [title]="title"
        [action]="action"
        [detail]="detail"
        [editable]="editable"
        [(state)]="state"
      />
    </div>`,
  }),
};
export default meta;

type Story = StoryObj<AgtApproval>;

export const Pending: Story = {
  args: {
    title: 'Approval required',
    action: 'Auto-approve KYC case #4821 (low risk).',
    detail: { risk: 'low', confidence: 0.98, sanctions: false, pep: false },
    editable: true,
    state: 'pending',
  },
};

export const Approved: Story = {
  args: {
    action: 'Auto-approve KYC case #4821 (low risk).',
    state: 'approved',
  },
};

export const Rejected: Story = {
  args: {
    action: 'Auto-approve KYC case #4821 (low risk).',
    state: 'rejected',
  },
};
