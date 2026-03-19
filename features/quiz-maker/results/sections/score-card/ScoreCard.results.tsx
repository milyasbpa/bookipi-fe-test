'use client';

import { Trophy, TrendingUp, Target } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useResultsStore } from '../../store/results.store';
import { useGetQuizResults } from '../../react-query';

/**
 * ScoreCardResults - Self-contained section
 * 
 * Responsibilities:
 * - Get submitResult from Zustand (set by Player after submit)
 * - Fetch quiz data via useGetQuizResults
 * - Calculate percentage from score/totalQuestions
 * - Display score with appropriate styling (perfect/good/needs improvement)
 * - Handle loading & error states
 * 
 * Anti-corruption: Uses proper Orval types (SubmitResult, QuizWithQuestions)
 */
export function ScoreCardResults() {
  const t = useTranslations('quiz-maker.results');
  
  const submitResult = useResultsStore((s) => s.submitResult);
  const quizId = useResultsStore((s) => s.quizId);

  // Fetch quiz data
  const { data: quiz, isLoading, error } = useGetQuizResults(quizId);

  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-lg border-2 border-border bg-card p-8 text-center">
        <div className="text-muted-foreground">{t('loading-score')}</div>
      </div>
    );
  }

  // Error state
  if (error || !quiz || !submitResult) {
    return (
      <div className="rounded-lg border-2 border-destructive bg-destructive/10 p-8 text-center">
        <p className="text-destructive">{t('score-load-error')}</p>
      </div>
    );
  }

  const score = submitResult.score ?? 0;
  const totalQuestions = quiz.questions?.length ?? 0;
  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  const isPerfect = score === totalQuestions && totalQuestions > 0;
  const isGood = percentage >= 70;
  const needsImprovement = percentage < 50;

  return (
    <div
      className={`
        rounded-lg border-2 p-8 text-center transition-colors
        ${
          isPerfect
            ? 'border-green-500 bg-green-50 dark:border-green-700 dark:bg-green-950'
            : isGood
              ? 'border-brand bg-brand/10'
              : needsImprovement
                ? 'border-orange-500 bg-orange-50 dark:border-orange-700 dark:bg-orange-950'
                : 'border-border bg-card'
        }
      `}
    >
      <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-brand/10">
        {isPerfect ? (
          <Trophy className="size-10 text-green-600 dark:text-green-400" />
        ) : isGood ? (
          <TrendingUp className="size-10 text-brand" />
        ) : (
          <Target className="size-10 text-orange-600 dark:text-orange-400" />
        )}
      </div>

      <h2 className="text-4xl font-bold text-foreground">
        {score} / {totalQuestions}
      </h2>

      <p className="text-muted-foreground mt-2 text-lg">
        {percentage.toFixed(0)}% {t('correct')}
      </p>

      {isPerfect && (
        <p className="mt-4 text-lg font-semibold text-green-600 dark:text-green-400">
          {t('perfect-score')}
        </p>
      )}

      {!isPerfect && isGood && (
        <p className="mt-4 text-lg font-semibold text-brand">
          {t('great-job')}
        </p>
      )}

      {needsImprovement && (
        <p className="mt-4 text-lg font-semibold text-orange-600 dark:text-orange-400">
          {t('keep-practicing')}
        </p>
      )}
    </div>
  );
}
