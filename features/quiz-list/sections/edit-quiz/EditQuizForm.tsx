'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

import { Button } from '@/core/components';
import { FormField } from '@/core/components';
import { Input } from '@/core/components';
import { useUpdateQuiz } from '../../react-query/use-update-quiz';
import { useBuilderStore } from '../../store/builder.store';

import { quizSchema, type QuizFormValues } from '../../components/quiz-form/quiz-form.builder.schema';

export function EditQuizForm() {
  const t = useTranslations('quiz-maker.builder');
  const { mutate, isPending } = useUpdateQuiz();
  const editQuizId = useBuilderStore((s) => s.editQuizId);
  const editQuizData = useBuilderStore((s) => s.editQuizData);

  const { control, handleSubmit, reset } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      timeLimitSeconds: 300,
      isPublished: true,
    },
  });

  // Pre-fill form when modal opens
  useEffect(() => {
    if (editQuizData) {
      reset({
        title: editQuizData.title,
        description: editQuizData.description,
        timeLimitSeconds: editQuizData.timeLimitSeconds ?? 300,
        isPublished: true,
      });
    }
  }, [editQuizData, reset]);

  const onSubmit = (values: QuizFormValues) => {
    if (!editQuizId) return;
    mutate({ id: editQuizId, data: values });
  };

  return (
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
  );
}
