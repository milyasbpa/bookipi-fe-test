'use client';

import { useDeleteQuestion as useDeleteQuestionGenerated } from '@/features/quiz-list/react-query/use-delete-question';

/**
 * Delete question hook
 * Wrapper for quiz-detail feature
 */
export function useDeleteQuestion(quizId: number) {
  return useDeleteQuestionGenerated(quizId);
}
