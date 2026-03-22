'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { usePlayerStore } from '../../store/player.store';
import { useGetQuizPlayer, useStartAttempt, useSubmitAttempt } from '../../react-query';
import { ProgressBar } from '../../components/progress-bar';
import { CountdownTimer } from '../../components/countdown-timer';

/**
 * QuizHeaderPlayer - Self-contained section
 * 
 * Responsibilities:
 * - Fetch quiz data via useGetQuizPlayer
 * - Start attempt via useStartAttempt on mount
 * - Display quiz metadata (title, description, time limit)
 * - Show progress bar with countdown timer
 * - Handle loading & error states
 */
export function QuizHeaderPlayer() {
  const t = useTranslations('quiz-maker.player');
  const params = useParams();
  const quizId = Number(params?.quizId);

  const attemptId = usePlayerStore((s) => s.attemptId);
  const currentQuestionIndex = usePlayerStore((s) => s.currentQuestionIndex);
  const setQuizId = usePlayerStore((s) => s.setQuizId);
  const remainingSeconds = usePlayerStore((s) => s.remainingSeconds);
  const setRemainingSeconds = usePlayerStore((s) => s.setRemainingSeconds);
  const phase = usePlayerStore((s) => s.phase);

  // Submit attempt mutation
  const { mutate: submitAttempt } = useSubmitAttempt(attemptId!, quizId);

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

  // Initialize timer when quiz loads
  useEffect(() => {
    if (phase === 'playing' && remainingSeconds === null && quiz?.timeLimitSeconds) {
      setRemainingSeconds(quiz.timeLimitSeconds);
    }
  }, [quiz, remainingSeconds, setRemainingSeconds, phase]);

  // Handle time up
  const handleTimeUp = () => {
    toast.info(t('time-up'));
    submitAttempt();
  };

  // Handle tick
  const handleTick = (newSeconds: number) => {
    setRemainingSeconds(newSeconds);
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
      <ProgressBar
        current={currentQuestionIndex}
        total={totalQuestions}
        progressLabel={t('progress-question')}
        ofLabel={t('of')}
      />

      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {quiz.title || t('untitled-quiz')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {quiz.description || t('no-description')}
        </p>
        {quiz.timeLimitSeconds && (
          <CountdownTimer
            remainingSeconds={remainingSeconds}
            onTick={handleTick}
            onTimeUp={handleTimeUp}
            timeRemainingLabel={t('time-remaining')}
          />
        )}
      </div>
    </div>
  );
}
