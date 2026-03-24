'use client';
'use no memo';

import { useReactTable, getCoreRowModel, ColumnDef, flexRender } from '@tanstack/react-table';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo, useState, useCallback } from 'react';

import type { Question } from '@/core/api/generated/quizMakerAPI.schemas';
import { Button, ConfirmationDialog } from '@/core/components';

import { useGetQuizDetail, useDeleteQuestion } from '../../react-query';
import { useQuizDetailStore } from '../../store/quiz-detail.store';

export function QuestionTable() {
  const params = useParams();
  const t = useTranslations('quiz-maker.builder');
  const quizId = Number(params.id);

  const { data: quiz, isLoading } = useGetQuizDetail(quizId);
  const deleteQuestion = useDeleteQuestion(quizId);
  const { openEditQuestionModal, openAddQuestionModal } = useQuizDetailStore();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);

  const questions = quiz?.questions || [];

  const handleDeleteClick = useCallback((questionId: number) => {
    setQuestionToDelete(questionId);
    setDeleteConfirmOpen(true);
  }, []);

  const handleConfirmDelete = () => {
    if (questionToDelete) {
      deleteQuestion.mutate({ id: questionToDelete });
      setQuestionToDelete(null);
    }
  };

  const columns = useMemo<ColumnDef<Question>[]>(
    () => [
      {
        accessorKey: 'position',
        header: '#',
        cell: (info) => (
          <span className="text-muted-foreground font-mono text-sm">
            {info.getValue() as number}
          </span>
        ),
        size: 60,
      },
      {
        accessorKey: 'type',
        header: t('type'),
        cell: (info) => (
          <span className="bg-muted rounded-full px-2 py-1 text-xs font-medium uppercase">
            {info.getValue() as string}
          </span>
        ),
        size: 100,
      },
      {
        accessorKey: 'prompt',
        header: t('question'),
        cell: (info) => <div className="max-w-md truncate">{info.getValue() as string}</div>,
      },
      {
        id: 'answer',
        header: t('answer-label'),
        cell: ({ row }) => {
          const question = row.original;
          if (question.type === 'mcq' && question.options) {
            const index =
              typeof question.correctAnswer === 'number'
                ? question.correctAnswer
                : parseInt(String(question.correctAnswer), 10);
            return (
              <div className="max-w-xs truncate text-sm">{question.options[index] || '-'}</div>
            );
          }
          return <div className="max-w-xs truncate text-sm">{question.correctAnswer || '-'}</div>;
        },
        size: 200,
      },
      {
        id: 'actions',
        header: '',
        cell({ row }) {
          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditQuestionModal(row.original)}
                className="gap-1"
              >
                <Edit className="size-3" />
                {t('edit')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteClick(row.original.id!)}
                className="text-destructive gap-1"
              >
                <Trash2 className="size-3" />
                {t('delete')}
              </Button>
            </div>
          );
        },
        size: 140,
      },
    ],
    [t, openEditQuestionModal, handleDeleteClick],
  );

  const table = useReactTable({
    data: questions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="bg-muted h-10 w-full animate-pulse rounded" />
        <div className="bg-muted h-20 w-full animate-pulse rounded" />
        <div className="bg-muted h-20 w-full animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {t('questions-list')} ({questions.length})
        </h2>
        <Button variant="primary" onClick={openAddQuestionModal} className="gap-2">
          <Plus className="size-4" />
          {t('add-question')}
        </Button>
      </div>

      {/* Table */}
      {questions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">{t('no-questions')}</p>
          <Button variant="outline" onClick={openAddQuestionModal} className="mt-4">
            {t('add-first-question')}
          </Button>
        </div>
      ) : (
        <>
          <div className="hidden rounded-lg border md:block">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-sm font-semibold"
                        style={{ width: header.getSize() }}
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
                  <tr
                    key={row.id}
                    className="hover:bg-muted/30 border-b transition-colors last:border-b-0"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {table.getRowModel().rows.map((row) => {
              const question = row.original;
              let answerDisplay = '-';

              if (question.type === 'mcq' && question.options) {
                const index =
                  typeof question.correctAnswer === 'number'
                    ? question.correctAnswer
                    : parseInt(String(question.correctAnswer), 10);
                answerDisplay = question.options[index] || '-';
              } else if (question.correctAnswer) {
                answerDisplay = String(question.correctAnswer);
              }

              return (
                <div key={row.id} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-mono text-sm">
                        #{question.position}
                      </span>
                      <span className="bg-muted rounded-full px-2 py-1 text-xs font-medium uppercase">
                        {question.type}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="font-medium">{question.prompt}</p>
                  </div>

                  <div className="text-muted-foreground mb-4 text-sm">
                    <span className="font-medium">{t('answer-label')}:</span>{' '}
                    <span className="line-clamp-2">{answerDisplay}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditQuestionModal(question)}
                      className="flex-1 gap-1"
                    >
                      <Edit className="size-3" />
                      {t('edit')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(question.id!)}
                      className="text-destructive flex-1 gap-1"
                    >
                      <Trash2 className="size-3" />
                      {t('delete')}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        message={t('delete-confirm')}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
