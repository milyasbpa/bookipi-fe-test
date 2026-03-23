import type { Meta, StoryObj } from '@storybook/react';
import { NavigationPlayer } from './Navigation.player';

// This is a demo story - actual rendering requires full app context with Zustand, React Query, etc.

const meta = {
  title: 'Features/Quiz Player/Sections/Navigation',
  component: NavigationPlayer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-2xl border p-6 rounded-lg">
        <p className="text-sm text-muted-foreground mb-4">
          Note: This section requires full app context with Zustand store and React Query.
          See tests for complete behavior coverage.
        </p>
        <Story />
      </div>
    ),
  ],
};
