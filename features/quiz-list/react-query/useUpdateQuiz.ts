'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useUpdateQuiz as useUpdateQuizGenerated } from '@/core/api/generated/quizzes/quizzes';
import { useQuizListStore } from '../store';';

export function useUpdateQuiz() {
  const t = useTranslations('quiz-maker.builder');
  const queryClient = useQueryClient();
  const closeEditModal = useQuizListStore((s) => s.closeEditModal);

  const mutation = useUpdateQuizGenerated({
    mutation: {
      onSuccess: (response) => {
        toast.success(t('quiz-updated'));
        // Invalidate both list and detail queries
        queryClient.invalidateQueries({ queryKey: ['/quizzes'] });
        if (response.id) {
          queryClient.invalidateQueries({ queryKey: [`/quizzes/${response.id}`] });
        }
        closeEditModal(); // Close modal after success
      },
      onError: () => {
        toast.error(t('quiz-update-error'));
      },
    },
  });

  return mutation;
}
