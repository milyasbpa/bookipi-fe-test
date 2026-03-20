'use client';

import { Plus, Play, Trash2, ListPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Button } from '@/core/components';
import type { QuizWithQuestions } from '@/core/api/generated/quizMakerAPI.schemas';
import { ROUTES } from '@/core/lib/routes';
import { useGetQuizzes } from '../../react-query/use-get-quizzes';
import { useBuilderStore } from '../../store/builder.store';

export function QuizListBuilder() {
  const t = useTranslations('quiz-maker.builder');
  const router = useRouter();
  const { data, isLoading } = useGetQuizzes();
  const openCreateModal = useBuilderStore((s) => s.openCreateModal);
  const openAddQuestionModal = useBuilderStore((s) => s.openAddQuestionModal);

  const quizzes = (data || []).filter((quiz) => quiz.id !== undefined);

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-muted-foreground">{t('loading-quizzes')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('your-quizzes')}</h2>
          <p className="text-muted-foreground mt-1 text-sm">{t('quiz-list-subtitle')}</p>
        </div>
        <Button onClick={openCreateModal} variant="primary" size="lg">
          <Plus className="mr-2 size-4" />
          {t('create-quiz')}
        </Button>
      </div>

      {/* Empty State */}
      {quizzes.length === 0 && (
        <div className="text-muted-foreground flex min-h-75 flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
          <ListPlus className="text-muted-foreground/50 mb-4 size-16" />
          <h3 className="mb-2 text-lg font-semibold">{t('no-quizzes-yet')}</h3>
          <p className="text-muted-foreground mb-4 text-sm">{t('no-quizzes-description')}</p>
          <Button onClick={openCreateModal} variant="primary">
            <Plus className="mr-2 size-4" />
            {t('create-first-quiz')}
          </Button>
        </div>
      )}

      {/* Quiz List */}
      {quizzes.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {quizzes.map((quiz: QuizWithQuestions) => {
            const questionCount = quiz.questions?.length || 0;
            const hasQuestions = questionCount > 0;

            return (
              <div
                key={quiz.id}
                className="flex flex-col rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Quiz Info */}
                <div className="mb-4 flex-1">
                  <h3 className="mb-2 text-lg font-semibold">{quiz.title}</h3>
                  <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                    {quiz.description}
                  </p>
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <span>
                      {questionCount} {questionCount === 1 ? t('question') : t('questions')}
                    </span>
                    {quiz.timeLimitSeconds && (
                      <span>
                        {Math.floor(quiz.timeLimitSeconds / 60)} {t('minutes')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => openAddQuestionModal(quiz.id!, quiz.title!)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <ListPlus className="mr-2 size-4" />
                    {t('add-questions')}
                  </Button>
                  {hasQuestions && (
                    <Button
                      onClick={() => router.push(ROUTES.QUIZ_PLAYER(quiz.id!))}
                      variant="primary"
                      size="sm"
                      className="flex-1"
                    >
                      <Play className="mr-2 size-4" />
                      {t('start-quiz')}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
