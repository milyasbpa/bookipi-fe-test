'use client';

import { useRecordEvent as useRecordEventGenerated } from '@/core/api/generated/attempts/attempts';

/**
 * Anti-cheat: Record events like focus/blur, paste detection
 * Bonus feature for tracking suspicious behavior
 */
export function useRecordEvent(attemptId: number) {
  const mutation = useRecordEventGenerated({
    mutation: {
      onSuccess: () => {
        // Silent - no toast for tracking events
      },
      onError: () => {
        // Silent - don't disrupt user experience
      },
    },
  });

  return mutation;
}
