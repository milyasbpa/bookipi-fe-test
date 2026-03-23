'use client';

import { useRouter } from 'next/navigation';

import { useStartAttempt as useStartAttemptGenerated } from '@/core/api/generated/attempts/attempts';
import { usePlayerStore } from '../../store/player.store';
import { quizPlayerMutationKeys } from '../keys';

export function useStartAttempt(quizId: number) {
  const router = useRouter();
  const setAttemptId = usePlayerStore((s) => s.setAttemptId);

  const mutation = useStartAttemptGenerated({
    mutation: {
      mutationKey: quizPlayerMutationKeys.startAttempt(quizId),
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
