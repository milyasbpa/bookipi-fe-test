'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { usePlayerStore } from '../../store/player.store';
import { useGetQuizPlayer, useStartAttempt } from '../../react-query';
import { ProgressBar } from '../../components/progress-bar/ProgressBar';

/**
 * QuizHeaderPlayer - Self-contained section
 * 
 * Responsibilities:
 * - Fetch quiz data via useGetQuizPlayer
 * - Start attempt via useStartAttempt on mount
 * - Display quiz metadata (title, description, time limit)
 * - Show progress bar
 * - Handle loading & error states
 * - Reset player state on unmount
 */
export function QuizHeaderPlayer() {
  const t = useTranslations('quiz-maker.player');
  const params = useParams();
  const quizId = Number(params?.quizId);

  const attemptId = usePlayerStore((s) => s.attemptId);
  const currentQuestionIndex = usePlayerStore((s) => s.currentQuestionIndex);
  const setQuizId = usePlayerStore((s) => s.setQuizId);
  const resetPlayer = usePlayerStore((s) => s.resetPlayer);

  // Fetch quiz data
  const { data: quiz, isLoading, error } = useGetQuizPlayer(quizId, {
    enabled: !!quizId && !isNaN(quizId),
  });

  // Store quizId when quiz is loaded
  useEffect(() => {
    if (quiz && quizId) {
      setQuizId(quizId);
    }
  }, [quiz, quizId, setQuizId]);

  // Start attempt on mount
  const { mutate: startAttempt, isPending: isStartingAttempt } = useStartAttempt();

  useEffect(() => {
    if (quiz && !attemptId && !isStartingAttempt) {
      startAttempt({ data: { quizId } });
    }
  }, [quiz, attemptId, quizId, startAttempt, isStartingAttempt]);

  // Reset player state when unmounting
  useEffect(() => {
    return () => {
      resetPlayer();
    };
  }, [resetPlayer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const unit = minutes === 1 ? t('minute') : t('minutes');
    return `${minutes} ${unit}`;
  };

  // Loading state
  if (isLoading || !quiz || !attemptId) {
    return (
      <div className="text-center text-muted-foreground">
        {t('loading-quiz')}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center text-destructive">
        {t('quiz-load-error')}
      </div>
    );
  }

  // No questions state
  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        {t('no-questions-yet')}
      </div>
    );
  }

  const totalQuestions = quiz.questions.length;

  return (
    <div className="space-y-6">
      <ProgressBar current={currentQuestionIndex} total={totalQuestions} />

      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {quiz.title || t('untitled-quiz')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {quiz.description || t('no-description')}
        </p>
        {quiz.timeLimitSeconds && (
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <Clock className="size-4" />
            <span>{t('time-limit')} {formatTime(quiz.timeLimitSeconds)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
