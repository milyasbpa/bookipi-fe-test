'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { Button } from '@/core/components';
import { FormField } from '@/core/components';
import { Input } from '@/core/components';
import { useCreateQuiz } from '../../react-query/use-create-quiz';

import { quizSchema, type QuizFormValues } from './quiz-form.builder.schema';

export function QuizFormBuilder() {
  const t = useTranslations('quiz-maker.builder');
  const { mutate, isPending } = useCreateQuiz();

  const { control, handleSubmit } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      timeLimitSeconds: 300,
      isPublished: true,
    },
  });

  const onSubmit = (values: QuizFormValues) => {
    mutate({ data: values });
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
        {isPending ? t('creating') : t('create-quiz')}
      </Button>
    </form>
  );
}
