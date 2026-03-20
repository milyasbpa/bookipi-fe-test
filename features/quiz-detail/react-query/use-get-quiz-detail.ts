'use client';

import { useGetQuiz as useGetQuizGenerated } from '@/features/quiz-list/react-query/use-get-quiz';

/**
 * Get quiz detail with questions
 * Wrapper hook for consistency with quiz-detail feature naming
 */
export function useGetQuizDetail(quizId: number, options?: { enabled?: boolean }) {
  return useGetQuizGenerated(quizId, options);
}
