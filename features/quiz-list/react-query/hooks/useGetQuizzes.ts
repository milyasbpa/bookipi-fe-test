'use client';

import { useGetQuizzes as useGetQuizzesGenerated } from '@/core/api/generated/quizzes/quizzes';
import { quizListQueryKeys } from '../keys';

/**
 * Hook to get all quizzes
 * Anti-corruption layer wrapper for useGetQuizzes Orval hook
 */
export function useGetQuizzes() {
  return useGetQuizzesGenerated({
    query: {
      queryKey: quizListQueryKeys.all(), // Use centralized query key
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
  });
}
