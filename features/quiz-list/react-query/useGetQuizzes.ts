'use client';

import { useGetQuizzes as useGetQuizzesGenerated } from '@/core/api/generated/quizzes/quizzes';

/**
 * Hook to get all quizzes
 * Anti-corruption layer wrapper for useGetQuizzes Orval hook
 */
export function useGetQuizzes() {
  return useGetQuizzesGenerated({
    query: {
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
  });
}
