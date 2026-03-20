'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useCreateQuestion as useCreateQuestionGenerated } from '@/core/api/generated/questions/questions';
import { useBuilderStore } from '../store/builder.store';

export function useCreateQuestion(quizId: number) {
  const t = useTranslations('quiz-maker.builder');
  const queryClient = useQueryClient();
  const setQuestionCount = useBuilderStore((s) => s.setQuestionCount);
  const currentCount = useBuilderStore((s) => s.questionCount);

  const mutation = useCreateQuestionGenerated({
    mutation: {
      onSuccess: () => {
        setQuestionCount(currentCount + 1);
        toast.success(t('question-added'));
        queryClient.invalidateQueries({ queryKey: [`/quizzes/${quizId}`] });
      },
      onError: () => {
        toast.error(t('question-add-error'));
      },
    },
  });

  return mutation;
}
