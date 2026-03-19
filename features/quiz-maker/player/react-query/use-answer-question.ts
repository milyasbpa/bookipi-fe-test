'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useAnswerQuestion as useAnswerQuestionGenerated } from '@/core/api/generated/attempts/attempts';

export function useAnswerQuestion(attemptId: number) {
  const t = useTranslations('quiz-maker.player');

  const mutation = useAnswerQuestionGenerated({
    mutation: {
      onSuccess: () => {
        // Silent success - no toast for each answer
      },
      onError: () => {
        toast.error(t('answer-save-error'));
      },
    },
  });

  return mutation;
}
