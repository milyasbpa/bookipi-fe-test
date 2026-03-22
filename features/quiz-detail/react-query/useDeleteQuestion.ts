'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useDeleteQuestion as useDeleteQuestionGenerated } from '@/core/api/generated/questions/questions';

export function useDeleteQuestion(quizId: number) {
  const t = useTranslations('quiz-maker.builder');
  const queryClient = useQueryClient();

  const mutation = useDeleteQuestionGenerated({
    mutation: {
      onSuccess: () => {
        toast.success(t('question-deleted'));
        queryClient.invalidateQueries({ queryKey: [`/quizzes/${quizId}`] });
      },
      onError: () => {
        toast.error(t('question-delete-error'));
      },
    },
  });

  return mutation;
}
