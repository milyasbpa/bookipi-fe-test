'use client';

import { useUpdateQuestion as useUpdateQuestionGenerated } from '@/features/quiz-list/react-query/use-update-question';

/**
 * Update question hook
 * Wrapper for quiz-detail feature
 */
export function useUpdateQuestion(quizId: number) {
  return useUpdateQuestionGenerated(quizId);
}
