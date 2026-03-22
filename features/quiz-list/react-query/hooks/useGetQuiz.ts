'use client';

import { useGetQuizById } from '@/core/api/generated/quizzes/quizzes';

export function useGetQuiz(quizId: number, options?: { enabled?: boolean }) {
  return useGetQuizById(quizId, {
    query: {
      enabled: options?.enabled ?? true,
    },
  });
}
