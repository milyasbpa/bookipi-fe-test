'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useSubmitAttempt as useSubmitAttemptGenerated } from '@/core/api/generated/attempts/attempts';
import { useAnswerQuestion } from '@/core/api/generated/attempts/attempts';
import type { SubmitResult } from '@/core/api/generated/quizMakerAPI.schemas';
import { usePlayerStore } from '../store/player.store';

export function useSubmitAttempt(attemptId: number, quizId: number) {
  const t = useTranslations('quiz-maker.player');
  const setPhaseCompleted = usePlayerStore((s) => s.setPhaseCompleted);
  const answers = usePlayerStore((s) => s.answers);

  const answerMutation = useAnswerQuestion();
  const submitMutation = useSubmitAttemptGenerated({
    mutation: {
      onSuccess: (data: SubmitResult) => {
        // Save result to player store and switch to completed phase
        setPhaseCompleted(data);
        
        toast.success(t('quiz-submitted'));
      },
      onError: () => {
        toast.error(t('submit-error'));
      },
    },
  });

  // Custom mutate function that saves all answers first, then submits
  const mutateWithAnswers = async () => {
    try {
      // Save all answers first
      const answerEntries = Object.entries(answers);
      
      if (answerEntries.length > 0) {
        toast.loading(t('saving-answers'), { id: 'saving-answers' });
        
        // Save each answer sequentially
        for (const [questionId, value] of answerEntries) {
          await answerMutation.mutateAsync({
            id: attemptId,
            data: {
              questionId: Number(questionId),
              value,
            },
          });
        }
        
        toast.dismiss('saving-answers');
      }

      // Then submit the attempt
      submitMutation.mutate({ id: attemptId });
    } catch (error) {
      toast.dismiss('saving-answers');
      toast.error(t('answer-save-error'));
    }
  };

  return {
    ...submitMutation,
    mutate: mutateWithAnswers,
    mutateAsync: mutateWithAnswers,
  };
}
