import { useQuery } from '@tanstack/react-query';

import { useGetQuizById } from '@/core/api/generated/quizzes/quizzes';

/**
 * Custom hook to fetch quiz data for Results feature
 * 
 * Anti-corruption layer:
 * - Wraps Orval-generated useGetQuizById
 * - Provides Results-specific query configuration
 * - Uses proper TypeScript types from Orval
 */
export function useGetQuizResults(quizId: number | null | undefined) {
  return useGetQuizById(
    quizId as number,
    {
      query: {
        enabled: !!quizId && !isNaN(quizId),
        staleTime: 5 * 60 * 1000, // 5 minutes - quiz data doesn't change often
        gcTime: 10 * 60 * 1000, // 10 minutes cache
      },
    }
  );
}
