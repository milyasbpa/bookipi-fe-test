'use client';

import { useRecordEvent as useRecordEventGenerated } from '@/core/api/generated/attempts/attempts';

import { quizPlayerMutationKeys } from '../keys';

/**
 * Anti-cheat: Record events like focus/blur, paste detection
 * Bonus feature for tracking suspicious behavior
 */
export function useRecordEvent(attemptId: number) {
  const mutation = useRecordEventGenerated({
    mutation: {
      mutationKey: quizPlayerMutationKeys.recordEvent(attemptId),
      onSuccess: () => {},
      onError: () => {},
    },
  });

  return mutation;
}
