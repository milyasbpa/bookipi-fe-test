'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button, ConfirmationDialog } from '@/core/components';
import { useGetQuizDetail, useDeleteQuestion } from '../../react-query';
import { useQuizDetailStore } from '../../store/quiz-detail.store';
import type { Question } from '@/core/api/generated/quizMakerAPI.schemas';

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

  const handleDeleteClick = (questionId: number) => {
    setQuestionToDelete(questionId);
    setDeleteConfirmOpen(true);
  };

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
          <span className="font-mono text-sm text-muted-foreground">
            {info.getValue() as number}
          </span>
        ),
        size: 60,
      },
      {
        accessorKey: 'type',
        header: t('type'),
        cell: (info) => (
          <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium uppercase">
            {info.getValue() as string}
          </span>
        ),
        size: 100,
      },
      {
        accessorKey: 'prompt',
        header: t('question'),
        cell: (info) => (
          <div className="max-w-md truncate">{info.getValue() as string}</div>
        ),
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
              <div className="max-w-xs truncate text-sm">
                {question.options[index] || '-'}
              </div>
            );
          }
          return (
            <div className="max-w-xs truncate text-sm">
              {question.correctAnswer || '-'}
            </div>
          );
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
                className="gap-1 text-destructive"
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
        <div className="h-10 w-full rounded bg-muted animate-pulse" />
        <div className="h-20 w-full rounded bg-muted animate-pulse" />
        <div className="h-20 w-full rounded bg-muted animate-pulse" />
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
        <Button
          variant="primary"
          onClick={openAddQuestionModal}
          className="gap-2"
        >
          <Plus className="size-4" />
          {t('add-question')}
        </Button>
      </div>

      {/* Table */}
      {questions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">{t('no-questions')}</p>
          <Button
            variant="outline"
            onClick={openAddQuestionModal}
            className="mt-4"
          >
            {t('add-first-question')}
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
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
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
