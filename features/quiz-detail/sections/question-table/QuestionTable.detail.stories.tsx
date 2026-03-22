import type { Meta, StoryObj } from '@storybook/react';
import { QuestionTable } from './QuestionTable.detail';

const meta: Meta<typeof QuestionTable> = {
  title: 'Features/QuizDetail/Sections/QuestionTable',
  component: QuestionTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QuestionTable>;

export const Default: Story = {};

export const Loading: Story = {};

export const Empty: Story = {};

export const WithQuestions: Story = {};
