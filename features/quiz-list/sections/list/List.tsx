'use client';

import { Plus, ListPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { flexRender } from '@tanstack/react-table';

import { Button } from '@/core/components';
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
        <Button onClick={() => router.push(ROUTES.QUIZ_CREATE)} variant="primary" size="lg">
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
          <Button onClick={() => router.push(ROUTES.QUIZ_CREATE)} variant="primary">
            <Plus className="mr-2 size-4" />
            {t('create-first-quiz')}
          </Button>
        </div>
      )}

      {/* Quiz Table */}
      {quizzes.length > 0 && (
        <div className="rounded-lg border bg-card">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-sm font-semibold"
                    >
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
                <tr key={row.id} className="border-b last:border-0 hover:bg-muted/30">
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
