'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useSubmitAttempt as useSubmitAttemptGenerated } from '@/core/api/generated/attempts/attempts';
import type { SubmitResult } from '@/core/api/generated/quizMakerAPI.schemas';
import { ROUTES } from '@/core/lib/routes';
import { useResultsStore } from '@/features/quiz-results/store/results.store';

export function useSubmitAttempt(attemptId: number, quizId: number) {
  const t = useTranslations('quiz-maker.player');
  const router = useRouter();
  const setSubmitResult = useResultsStore((s) => s.setSubmitResult);

  const mutation = useSubmitAttemptGenerated({
    mutation: {
      onSuccess: (data: SubmitResult) => {
        // Save result to Results store for Results page
        setSubmitResult(quizId, data);
        
        toast.success(t('quiz-submitted'));
        router.push(ROUTES.QUIZ_RESULTS(attemptId));
      },
      onError: () => {
        toast.error(t('submit-error'));
      },
    },
  });

  return mutation;
}
