'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { Question, SubmitResultDetailsItem } from '@/core/api/generated/quizMakerAPI.schemas';
import { usePlayerStore } from '../../store/player.store';
import { useGetQuizPlayer } from '../../react-query';

/**
 * QuestionBreakdownPlayer - Results question breakdown section
 * 
 * Responsibilities:
 * - Get details from player store
 * - Fetch quiz data via useGetQuizPlayer
 * - Display each question with correct/incorrect indicator
 * - Show correct answer for incorrect questions
 * - Handle loading & error states
 * 
 * Shown when phase = 'completed'
 */
export function QuestionBreakdownPlayer() {
  const t = useTranslations('quiz-maker.results');
  
  const submitResult = usePlayerStore((s) => s.submitResult);
  const quizId = usePlayerStore((s) => s.quizId);

  // Fetch quiz data
  const { data: quiz, isLoading, error } = useGetQuizPlayer(quizId!, {
    enabled: !!quizId,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-lg border-2 border-border bg-card p-8">
        <div className="text-center text-muted-foreground">{t('loading-breakdown')}</div>
      </div>
    );
  }

  // Error state
  if (error || !quiz || !submitResult) {
    return (
      <div className="rounded-lg border-2 border-destructive bg-destructive/10 p-8">
        <p className="text-center text-destructive">{t('breakdown-load-error')}</p>
      </div>
    );
  }

  const questions = quiz.questions ?? [];
  const details = submitResult.details ?? [];

  if (questions.length === 0) {
    return (
      <div className="rounded-lg border-2 border-border bg-card p-8">
        <p className="text-center text-muted-foreground">{t('no-questions')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 border-border bg-card p-8">
      <h2 className="mb-6 text-2xl font-bold text-foreground">{t('question-breakdown-title')}</h2>

      <div className="space-y-4">
        {questions.map((question: Question, index: number) => {
          const detail = details.find((d: SubmitResultDetailsItem) => d.questionId === question.id);
          const isCorrect = detail?.correct ?? false;

          return (
            <div
              key={question.id}
              className={`
                rounded-lg border-2 p-4 transition-colors
                ${
                  isCorrect
                    ? 'border-green-500 bg-green-50 dark:border-green-700 dark:bg-green-950'
                    : 'border-red-500 bg-red-50 dark:border-red-700 dark:bg-red-950'
                }
              `}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="mt-1 size-6 shrink-0 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="mt-1 size-6 shrink-0 text-red-600 dark:text-red-400" />
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-muted-foreground">
                      Question {index + 1}
                    </span>
                    <span
                      className={`
                        text-sm font-medium
                        ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}
                      `}
                    >
                      {isCorrect ? t('correct') : t('incorrect')}
                    </span>
                  </div>

                  <p className="mt-2 text-foreground">{question.prompt}</p>

                  {!isCorrect && detail?.expected && (
                    <div className="mt-3 rounded bg-background/50 p-3">
                      <p className="text-sm text-muted-foreground">
                        {t('correct-answer-label')}
                      </p>
                      <p className="mt-1 font-medium text-foreground">{detail.expected}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
