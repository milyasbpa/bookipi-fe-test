'use client';

import { Plus, Play, ListPlus, Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from '@tanstack/react-table';
import { useMemo } from 'react';

import { Button } from '@/core/components';
import type { QuizWithQuestions } from '@/core/api/generated/quizMakerAPI.schemas';
import { ROUTES } from '@/core/lib/routes';
import { useGetQuizzes } from '../../react-query/use-get-quizzes';
import { useBuilderStore } from '../../store/builder.store';

const columnHelper = createColumnHelper<QuizWithQuestions>();

export function QuizListBuilder() {
  const t = useTranslations('quiz-maker.builder');
  const router = useRouter();
  const { data, isLoading } = useGetQuizzes();
  const openCreateModal = useBuilderStore((s) => s.openCreateModal);
  const openAddQuestionModal = useBuilderStore((s) => s.openAddQuestionModal);
  const openEditModal = useBuilderStore((s) => s.openEditModal);

  const quizzes = (data || []).filter((quiz) => quiz.id !== undefined);

  const columns = useMemo<ColumnDef<QuizWithQuestions, any>[]>(
    () => [
      columnHelper.accessor('title', {
        header: t('quiz-title'),
        cell: (info) => (
          <div className="min-w-[200px]">
            <div className="font-semibold">{info.getValue()}</div>
            <div className="text-muted-foreground mt-1 text-sm line-clamp-2">
              {info.row.original.description}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('questions', {
        header: t('questions'),
        cell: (info) => {
          const count = info.getValue()?.length || 0;
          return (
            <span className="text-sm">
              {count} {count === 1 ? t('question') : t('questions')}
            </span>
          );
        },
      }),
      columnHelper.accessor('timeLimitSeconds', {
        header: t('time-limit'),
        cell: (info) => {
          const seconds = info.getValue();
          if (!seconds) return <span className="text-muted-foreground text-sm">-</span>;
          return (
            <span className="text-sm">
              {Math.floor(seconds / 60)} {t('minutes')}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: t('actions'),
        cell: (info) => {
          const quiz = info.row.original;
          const questionCount = quiz.questions?.length || 0;

          return (
            <div className="flex gap-2">
              <Button
                onClick={() =>
                  openEditModal(quiz.id!, {
                    title: quiz.title!,
                    description: quiz.description!,
                    timeLimitSeconds: quiz.timeLimitSeconds ?? undefined,
                  })
                }
                variant="outline"
                size="sm"
                title={t('edit')}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                onClick={() => openAddQuestionModal(quiz.id!, quiz.title!)}
                variant="outline"
                size="sm"
                title={t('add-questions')}
              >
                <ListPlus className="size-4" />
              </Button>
              <Button
                onClick={() => {
                  if (questionCount === 0) {
                    toast.warning(t('no-questions-warning'));
                    return;
                  }
                  router.push(ROUTES.QUIZ_PLAYER(quiz.id!));
                }}
                variant="primary"
                size="sm"
                title={t('start-quiz')}
              >
                <Play className="size-4" />
              </Button>
            </div>
          );
        },
      }),
    ],
    [t, openEditModal, openAddQuestionModal, router],
  );

  const table = useReactTable({
    data: quizzes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
