import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AgtSummary } from './agt-summary';

const summary = `**Low risk.** The passport was extracted with 98% confidence and the name matches the application exactly. The utility-bill address is consistent, and there were no sanctions or PEP hits.

- Document: passport (valid)
- Name match: exact
- Sanctions / PEP: none

Recommendation: **approve** with a standard 12-month review.`;

const meta: Meta<AgtSummary> = {
  title: 'Components/Summary',
  component: AgtSummary,
  decorators: [moduleMetadata({ imports: [AgtSummary] })],
  render: (args) => ({
    props: args,
    template: `<div style="max-width: 560px; margin: 0 auto; padding: 32px;">
      <agt-summary
        [title]="title"
        [content]="content"
        [loading]="loading"
        [streaming]="streaming"
      />
    </div>`,
  }),
};
export default meta;

type Story = StoryObj<AgtSummary>;

export const Loaded: Story = {
  args: { title: 'Case summary', content: summary, loading: false, streaming: false },
};

export const Loading: Story = {
  args: { title: 'Case summary', content: '', loading: true, streaming: false },
};

export const Streaming: Story = {
  args: { title: 'Case summary', content: summary, loading: false, streaming: true },
};
