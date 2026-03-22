'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

import { Button, Dialog, FormField, Input } from '@/core/components';
import { useUpdateQuiz } from '../../react-query/useUpdateQuiz';
import { useQuizListStore } from '../../store';
import { quizSchema, type QuizFormValues } from '@/core/schemas';

/**
 * Edit quiz section - manages edit quiz modal with form
 * Handles API integration and store state for editing quiz metadata
 */
export function Edit() {
  const t = useTranslations('quiz-maker.builder');
  
  // Store integration
  const isOpen = useQuizListStore((s) => s.isEditModalOpen);
  const closeModal = useQuizListStore((s) => s.closeEditModal);
  const editQuizId = useQuizListStore((s) => s.editQuizId);
  const editQuizData = useQuizListStore((s) => s.editQuizData);

  // API integration
  const { mutate, isPending } = useUpdateQuiz();

  // Form state
  const { control, handleSubmit, reset } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      timeLimitSeconds: 300,
    },
  });

  // Pre-fill form when modal opens
  useEffect(() => {
    if (editQuizData) {
      reset({
        title: editQuizData.title,
        description: editQuizData.description,
        timeLimitSeconds: editQuizData.timeLimitSeconds ?? 300,
      });
    }
  }, [editQuizData, reset]);

  const onSubmit = (values: QuizFormValues) => {
    if (!editQuizId) return;
    // Always send isPublished: true to API
    mutate({ id: editQuizId, data: { ...values, isPublished: true } });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeModal}
      title={t('edit-quiz-modal-title')}
      description={t('edit-quiz-modal-description')}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="title"
          control={control}
          label={t('title-label')}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              placeholder={t('title-placeholder')}
              disabled={isPending}
              aria-invalid={!!fieldState.error}
            />
          )}
        />

        <FormField
          name="description"
          control={control}
          label={t('description-label')}
          render={({ field, fieldState }) => (
            <textarea
              {...field}
              placeholder={t('description-placeholder')}
              disabled={isPending}
              className="w-full rounded-xl border border-border bg-transparent p-4 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring disabled:opacity-50"
              rows={3}
              aria-invalid={!!fieldState.error}
            />
          )}
        />

        <FormField
          name="timeLimitSeconds"
          control={control}
          label={t('time-limit-label')}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              value={field.value ?? ''}
              type="number"
              min={60}
              max={7200}
              disabled={isPending}
              onChange={(e) => field.onChange(e.target.valueAsNumber || null)}
              aria-invalid={!!fieldState.error}
            />
          )}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isPending}
          className="w-full"
        >
          {isPending ? t('updating') : t('update-quiz')}
        </Button>
      </form>
    </Dialog>
  );
}
