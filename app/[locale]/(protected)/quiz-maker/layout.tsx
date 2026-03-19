import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quiz Maker - Create and Take Quizzes',
  description: 'Create interactive quizzes with multiple question types, take quizzes, and view detailed results.',
};

/**
 * Quiz Maker Layout
 * 
 * Provides metadata for all quiz-maker routes:
 * - /quiz-maker/builder - Create and edit quizzes
 * - /quiz-maker/player/:quizId - Take quizzes
 * - /quiz-maker/results/:attemptId - View quiz results
 */
export default function QuizMakerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
