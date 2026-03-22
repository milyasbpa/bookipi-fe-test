'use client';

import { useDeleteQuestion as useDeleteQuestionGenerated } from '@/features/quiz-list/react-query/useDeleteQuestion';

/**
 * Delete question hook
 * Wrapper for quiz-detail feature
 */
export function useDeleteQuestion(quizId: number) {
  return useDeleteQuestionGenerated(quizId);
}
