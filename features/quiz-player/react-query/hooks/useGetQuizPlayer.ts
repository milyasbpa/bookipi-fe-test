import { useGetQuizById } from '@/core/api/generated/quizzes/quizzes';
import { quizPlayerQueryKeys } from '../keys';

/**
 * useGetQuizPlayer - Anti-corruption wrapper for useGetQuizById (Player feature)
 * 
 * Simple wrapper with no side effects - just fetches quiz data for display.
 * Used in player container to load quiz information before starting attempt.
 */
export function useGetQuizPlayer(quizId: number, options?: { enabled?: boolean }) {
  return useGetQuizById(quizId, {
    query: {
      queryKey: quizPlayerQueryKeys.quiz(quizId),
      enabled: options?.enabled ?? true,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  });
}
