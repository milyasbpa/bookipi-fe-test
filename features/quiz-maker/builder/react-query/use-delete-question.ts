'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useDeleteQuestion as useDeleteQuestionGenerated } from '@/core/api/generated/questions/questions';
import { useBuilderStore } from '../store/builder.store';

export function useDeleteQuestion(quizId: number) {
  const t = useTranslations('quiz-maker.builder');
  const queryClient = useQueryClient();
  const setQuestionCount = useBuilderStore((s) => s.setQuestionCount);
  const currentCount = useBuilderStore((s) => s.questionCount);

  const mutation = useDeleteQuestionGenerated({
    mutation: {
      onSuccess: () => {
        setQuestionCount(Math.max(0, currentCount - 1));
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
