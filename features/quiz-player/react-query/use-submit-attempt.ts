'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useSubmitAttempt as useSubmitAttemptGenerated } from '@/core/api/generated/attempts/attempts';
import type { SubmitResult } from '@/core/api/generated/quizMakerAPI.schemas';
import { usePlayerStore } from '../store/player.store';

export function useSubmitAttempt(attemptId: number, quizId: number) {
  const t = useTranslations('quiz-maker.player');
  const setPhaseCompleted = usePlayerStore((s) => s.setPhaseCompleted);

  const mutation = useSubmitAttemptGenerated({
    mutation: {
      onSuccess: (data: SubmitResult) => {
        // Save result to player store and switch to completed phase
        setPhaseCompleted(data);
        
        toast.success(t('quiz-submitted'));
      },
      onError: () => {
        toast.error(t('submit-error'));
      },
    },
  });

  return mutation;
}
