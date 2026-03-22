'use client';

import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/core/components';
import type { Question } from '@/core/api/generated/quizMakerAPI.schemas';
import { useQuizListStore } from '../../store';
import { useGetQuiz, useDeleteQuestion } from '../../react-query';

export function QuestionListBuilder() {
  const t = useTranslations('quiz-maker.builder');
  const currentQuizId = useQuizListStore((s) => s.currentQuizId);

  const { data, isLoading } = useGetQuiz(currentQuizId || 0, {
    enabled: !!currentQuizId,
  });

  const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestion(
    currentQuizId || 0,
  );

  const questions = data?.questions || [];

  if (!currentQuizId) return null;

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground">{t('loading-questions')}</div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
        {t('no-questions')}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">
        {t('questions')} ({questions.length})
      </h3>

      {questions.map((question: Question, index: number) => (
        <div key={question.id} className="rounded-lg border p-4">
          <div className="flex justify-between gap-4">
            <div className="flex-1">
              <p className="font-medium">
                {index + 1}. {question.prompt}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {t('type-label')} {question.type?.toUpperCase() || t('type-na')}
              </p>

              {question.type === 'mcq' && question.options && (
                <ul className="mt-2 space-y-1 text-sm">
                  {question.options.map((opt: string, i: number) => (
                    <li
                      key={i}
                      className={
                        i === question.correctAnswer
                          ? 'font-semibold text-green-600'
                          : 'text-muted-foreground'
                      }
                    >
                      {String.fromCharCode(65 + i)}. {opt}
                      {i === question.correctAnswer && ' ✓'}
                    </li>
                  ))}
                </ul>
              )}

              {question.type === 'short' && (
                <p className="mt-2 text-sm">
                  <span className="text-muted-foreground">{t('answer-label')}</span>{' '}
                  <span className="font-medium">{question.correctAnswer}</span>
                </p>
              )}
            </div>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => {
                if (question.id && confirm(t('delete-confirm'))) {
                  deleteQuestion({ id: question.id });
                }
              }}
              disabled={isDeleting}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
