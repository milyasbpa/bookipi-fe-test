'use client';

import { useRouter } from 'next/navigation';

import { useStartAttempt as useStartAttemptGenerated } from '@/core/api/generated/attempts/attempts';
import { usePlayerStore } from '../store/player.store';

export function useStartAttempt() {
  const router = useRouter();
  const setAttemptId = usePlayerStore((s) => s.setAttemptId);

  const mutation = useStartAttemptGenerated({
    mutation: {
      onSuccess: (response) => {
        const attemptId = response.id;
        if (attemptId) {
          setAttemptId(attemptId);
        }
      },
      onError: () => {
        router.push('/quiz-maker/builder');
      },
    },
  });

  return mutation;
}
