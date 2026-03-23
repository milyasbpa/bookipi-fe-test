import type { Meta, StoryObj } from '@storybook/react';
import { PlayerContainer } from './Player.container';

const meta = {
  title: 'Features/Quiz Player/Container/Player',
  component: PlayerContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlayerContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="p-6">
        <div className="max-w-4xl mx-auto border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-4">
            Note: This container orchestrates the entire quiz player experience.
            It requires full app context with Next.js routing, Zustand store, React Query, and translations.
            The container manages two phases: 'playing' (shows header, question view, navigation) and 'completed' (shows results).
            See section and component tests for detailed behavior coverage.
          </p>
          <Story />
        </div>
      </div>
    ),
  ],
};
