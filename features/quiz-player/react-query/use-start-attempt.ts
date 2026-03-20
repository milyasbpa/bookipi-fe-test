'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useStartAttempt as useStartAttemptGenerated } from '@/core/api/generated/attempts/attempts';
import { usePlayerStore } from '../store/player.store';

export function useStartAttempt() {
  const t = useTranslations('quiz-maker.player');
  const router = useRouter();
  const setAttemptId = usePlayerStore((s) => s.setAttemptId);

  const mutation = useStartAttemptGenerated({
    mutation: {
      onSuccess: (response) => {
        const attemptId = response.id;
        if (attemptId) {
          setAttemptId(attemptId);
          toast.success(t('attempt-started'));
        }
      },
      onError: () => {
        toast.error(t('attempt-start-error'));
        router.push('/quiz-maker/builder');
      },
    },
  });

  return mutation;
}
