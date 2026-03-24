'use client';

import { flexRender } from '@tanstack/react-table';
import { Plus, ListPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button, EmptyState, LoadingState } from '@/core/components';
import { ROUTES } from '@/core/lib/routes';

import { useGetQuizzes } from '../../react-query/hooks';
import { useQuizListTable } from '../../react-table';

export function List() {
  const t = useTranslations('quiz-maker.builder');
  const router = useRouter();
  const { data, isLoading } = useGetQuizzes();

  const quizzes = (data || []).filter((quiz) => quiz.id !== undefined);
  const table = useQuizListTable(quizzes);

  if (isLoading) {
    return <LoadingState message={t('loading-quizzes')} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
        <div className="bg-card rounded-lg border">
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
      )}
    </div>
  );
}
