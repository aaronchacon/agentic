import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AgtSuggestion } from './agt-suggestion';

const meta: Meta<AgtSuggestion> = {
  title: 'Components/Suggestion',
  component: AgtSuggestion,
  decorators: [moduleMetadata({ imports: [AgtSuggestion] })],
  render: (args) => ({
    props: args,
    template: `<div style="max-width: 460px; margin: 0 auto; padding: 32px;">
      <agt-suggestion
        [label]="label"
        [placeholder]="placeholder"
        [suggestion]="suggestion"
        [confidence]="confidence"
        [(value)]="value"
        [(accepted)]="accepted"
      />
    </div>`,
  }),
};
export default meta;

type Story = StoryObj<AgtSuggestion>;

export const Suggested: Story = {
  args: {
    label: 'Full name',
    placeholder: 'Enter full name',
    suggestion: 'Ada Lovelace',
    confidence: 0.98,
    value: '',
    accepted: false,
  },
};

export const Accepted: Story = {
  args: {
    label: 'Full name',
    suggestion: 'Ada Lovelace',
    confidence: 0.98,
    value: 'Ada Lovelace',
    accepted: true,
  },
};

export const EditedByHuman: Story = {
  args: {
    label: 'Full name',
    suggestion: 'Ada Lovelace',
    confidence: 0.98,
    value: 'Ada K. Lovelace',
    accepted: true,
  },
};
