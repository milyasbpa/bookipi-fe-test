import type { Meta, StoryObj } from '@storybook/react';

import { AntiCheatSummaryPlayer } from './AntiCheatSummary.player';

const meta = {
  title: 'Features/Quiz Player/Sections/Results - Anti-Cheat Summary',
  component: AntiCheatSummaryPlayer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AntiCheatSummaryPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InContainer: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
};
