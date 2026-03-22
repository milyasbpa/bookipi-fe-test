'use client';

import { useCreateQuestion as useCreateQuestionGenerated } from '@/features/quiz-list/react-query/useCreateQuestion';

/**
 * Create question hook
 * Wrapper for quiz-detail feature
 */
export function useCreateQuestion(quizId: number) {
  return useCreateQuestionGenerated(quizId);
}
