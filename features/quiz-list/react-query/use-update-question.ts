'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useUpdateQuestion as useUpdateQuestionGenerated } from '@/core/api/generated/questions/questions';

export function useUpdateQuestion(quizId: number) {
  const t = useTranslations('quiz-maker.builder');
  const queryClient = useQueryClient();

  const mutation = useUpdateQuestionGenerated({
    mutation: {
      onSuccess: () => {
        toast.success(t('question-updated'));
        queryClient.invalidateQueries({ queryKey: [`/quizzes/${quizId}`] });
      },
      onError: () => {
        toast.error(t('question-update-error'));
      },
    },
  });

  return mutation;
}
