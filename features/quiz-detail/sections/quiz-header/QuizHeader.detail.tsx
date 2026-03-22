'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Play } from 'lucide-react';

import { Button } from '@/core/components';
import { useGetQuizDetail } from '../../react-query';
import { ROUTES } from '@/core/lib/routes';
import { useQuizDetailStore } from '../../store/quiz-detail.store';

export function QuizHeader() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('quiz-maker.builder');
  const quizId = Number(params.id);

  const { data: quiz, isLoading } = useGetQuizDetail(quizId);
  const openEditModal = useQuizDetailStore((s) => s.openEditQuizModal);

  const handleEdit = () => {
    if (!quiz) return;
    openEditModal({
      title: quiz.title || '',
      description: quiz.description || '',
      timeLimitSeconds: quiz.timeLimitSeconds ?? undefined,
    });
  };

  const handlePlay = () => {
    router.push(ROUTES.QUIZ_PLAYER(quizId));
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-10 w-32 rounded bg-muted" />
        <div className="h-8 w-64 rounded bg-muted" />
        <div className="h-6 w-96 rounded bg-muted" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
        <p className="text-destructive">{t('quiz-not-found')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(ROUTES.QUIZ_LIST)}
        className="gap-2"
      >
        <ArrowLeft className="size-4" />
        {t('back-to-list')}
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold">{quiz.title}</h1>
          <p className="text-muted-foreground">{quiz.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              {t('questions-count', { count: quiz.questions?.length || 0 })}
            </span>
            <span>•</span>
            <span>
              {quiz.timeLimitSeconds
                ? t('time-limit-minutes', {
                    minutes: Math.floor(quiz.timeLimitSeconds / 60),
                  })
                : t('no-time-limit')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            {t('edit-quiz')}
          </Button>
          <Button variant="primary" onClick={handlePlay} className="gap-2">
            <Play className="size-4" />
            {t('play-quiz')}
          </Button>
        </div>
      </div>
    </div>
  );
}
