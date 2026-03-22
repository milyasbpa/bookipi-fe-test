'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useCreateQuestion as useCreateQuestionGenerated } from '@/core/api/generated/questions/questions';

/**
 * useCreateQuestion Hook
 * 
 * Hook for creating questions in quiz-create feature
 * Wraps generated API hook with success/error handling
 */
export function useCreateQuestion(quizId: number) {
  const t = useTranslations('quiz-maker.builder');
  const queryClient = useQueryClient();

  const mutation = useCreateQuestionGenerated({
    mutation: {
      onSuccess: () => {
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
