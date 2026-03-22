'use client';

import { useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/core/components';
import { usePlayerStore } from '../../store/player.store';
import { useSubmitAttempt, useGetQuizPlayer } from '../../react-query';

/**
 * NavigationPlayer - Self-contained section
 * 
 * Responsibilities:
 * - Access attemptId & currentQuestionIndex from Zustand
 * - Fetch quiz to get totalQuestions count
 * - Handle Previous/Next navigation via Zustand actions
 * - Handle Submit via useSubmitAttempt
 */
export function NavigationPlayer() {
  const t = useTranslations('quiz-maker.player');
  const params = useParams();
  const quizId = Number(params?.quizId);

  const attemptId = usePlayerStore((s) => s.attemptId);
  const currentQuestionIndex = usePlayerStore((s) => s.currentQuestionIndex);
  const goToNext = usePlayerStore((s) => s.goToNext);
  const goToPrevious = usePlayerStore((s) => s.goToPrevious);

  // Fetch quiz to get totalQuestions
  const { data: quiz } = useGetQuizPlayer(quizId, {
    enabled: !!quizId && !isNaN(quizId) && !!attemptId,
  });

  const { mutate: submitAttempt, isPending: isSubmitting } = useSubmitAttempt(attemptId || 0, quizId);

  // Don't render until we have quiz data and attemptId
  if (!quiz || !attemptId || !quiz.questions) {
    return null;
  }

  const totalQuestions = quiz.questions.length;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleSubmit = () => {
    if (confirm(t('submit-confirm'))) {
      submitAttempt();
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 pt-6 border-t">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={goToPrevious}
        disabled={isFirstQuestion || isSubmitting}
      >
        <ChevronLeft className="size-4" />
        {t('previous')}
      </Button>

      <div className="flex gap-3">
        {!isLastQuestion && (
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={() => goToNext(totalQuestions)}
            disabled={isSubmitting}
          >
            {t('next')}
            <ChevronRight className="size-4" />
          </Button>
        )}

        {isLastQuestion && (
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Send className="size-4" />
            {isSubmitting ? t('submitting') : t('submit')}
          </Button>
        )}
      </div>
    </div>
  );
}
