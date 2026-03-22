'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useCreateQuiz as useCreateQuizGenerated } from '@/core/api/generated/quizzes/quizzes';
import { useQuizListStore } from '../store';

export function useCreateQuiz() {
  const t = useTranslations('quiz-maker.builder');
  const queryClient = useQueryClient();
  const setCurrentQuizId = useQuizListStore((s) => s.setCurrentQuizId);
  const closeCreateModal = useQuizListStore((s) => s.closeCreateModal);

  const mutation = useCreateQuizGenerated({
    mutation: {
      onSuccess: (response) => {
        const quizId = response.id;
        if (quizId) {
          setCurrentQuizId(quizId);
          toast.success(t('quiz-created'));
          queryClient.invalidateQueries({ queryKey: ['/quizzes'] });
          closeCreateModal(); // Close modal after success
        }
      },
      onError: () => {
        toast.error(t('quiz-create-error'));
      },
    },
  });

  return mutation;
}
