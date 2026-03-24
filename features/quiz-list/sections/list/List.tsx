'use client';

import { flexRender } from '@tanstack/react-table';
import { Plus, ListPlus, Settings, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Button, EmptyState, LoadingState } from '@/core/components';
import { ROUTES } from '@/core/lib/routes';

import { useGetQuizzes } from '../../react-query/hooks';
import { useQuizListTable } from '../../react-table';

export function List() {
  const t = useTranslations('quiz-maker.builder');
  const router = useRouter();
  const { data, isLoading } = useGetQuizzes();

  // Memoize filtered array to prevent unnecessary re-renders
  const quizzes = useMemo(() => (data || []).filter((quiz) => quiz.id !== undefined), [data]);
  const table = useQuizListTable(quizzes);

  if (isLoading) {
    return <LoadingState message={t('loading-quizzes')} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button onClick={() => router.push(ROUTES.QUIZ_CREATE)} variant="primary" size="lg">
          <Plus className="mr-2 size-4" />
          {t('create-quiz')}
        </Button>
      </div>

      {quizzes.length === 0 && (
        <EmptyState
          icon={<ListPlus />}
          title={t('no-quizzes-yet')}
          description={t('no-quizzes-description')}
          action={
            <Button onClick={() => router.push(ROUTES.QUIZ_CREATE)} variant="primary">
              <Plus className="mr-2 size-4" />
              {t('create-first-quiz')}
            </Button>
          }
          className="border-2 border-dashed"
        />
      )}

      {quizzes.length > 0 && (
        <>
          <div className="bg-card hidden rounded-lg border md:block">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-6 py-3 text-left text-sm font-semibold">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30 border-b last:border-0">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 md:hidden">
            {table.getRowModel().rows.map((row) => {
              const quiz = row.original;
              return (
                <div key={row.id} className="bg-card rounded-lg border p-4">
                  <div className="mb-3 min-w-50">
                    <div className="font-semibold">{quiz.title}</div>
                    <div className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                      {quiz.description}
                    </div>
                  </div>

                  {quiz.timeLimitSeconds && (
                    <div className="text-muted-foreground mb-4 text-sm">
                      ⏱️ {Math.floor(quiz.timeLimitSeconds / 60)} {t('minutes')}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => router.push(ROUTES.QUIZ_DETAIL(quiz.id!))}
                      variant="outline"
                      size="sm"
                      title={t('manage-questions')}
                      className="flex-1"
                    >
                      <Settings className="size-4" />
                      <span className="ml-1">{t('manage-questions')}</span>
                    </Button>
                    <Button
                      onClick={() => router.push(ROUTES.QUIZ_PLAYER(quiz.id!))}
                      variant="primary"
                      size="sm"
                      title={t('start-quiz')}
                      className="flex-1"
                    >
                      <Play className="size-4" />
                      <span className="ml-1">{t('start-quiz')}</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
