'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useUpdateQuizById } from '@/core/api/generated/quizzes/quizzes';
import { useQuizDetailStore } from '../store/quiz-detail.store';
import { ROUTES } from '@/core/lib/routes';

export function useUpdateQuiz() {
  const params = useParams();
  const router = useRouter();
  const quizId = Number(params.id);
  const queryClient = useQueryClient();
  const t = useTranslations('quiz-maker.builder');
  const closeEditModal = useQuizDetailStore((s) => s.closeEditQuizModal);

  const mutation = useUpdateQuizById({
    mutation: {
      onSuccess: () => {
        toast.success(t('quiz-updated'));
        closeEditModal();
        queryClient.invalidateQueries({ queryKey: [`/quizzes/${quizId}`] });
      },
      onError: () => {
        toast.error(t('quiz-update-error'));
      },
    },
  });

  return mutation;
}
