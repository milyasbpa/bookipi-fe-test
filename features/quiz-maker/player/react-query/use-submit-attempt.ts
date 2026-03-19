'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useSubmitAttempt as useSubmitAttemptGenerated } from '@/core/api/generated/attempts/attempts';
import { ROUTES } from '@/core/lib/routes';

export function useSubmitAttempt(attemptId: number) {
  const t = useTranslations('quiz-maker.player');
  const router = useRouter();

  const mutation = useSubmitAttemptGenerated({
    mutation: {
      onSuccess: () => {
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
