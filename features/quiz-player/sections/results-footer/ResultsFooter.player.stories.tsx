import type { Meta, StoryObj } from '@storybook/react';
import { ResultsFooter } from './ResultsFooter.player';

const meta = {
  title: 'Features/Quiz Player/Sections/Results - Footer',
  component: ResultsFooter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ResultsFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-2xl border p-6 rounded-lg">
        <p className="text-sm text-muted-foreground mb-4">
          Note: This section requires full app context with Zustand store.
          See tests for complete behavior coverage.
        </p>
        <Story />
      </div>
    ),
  ],
};
