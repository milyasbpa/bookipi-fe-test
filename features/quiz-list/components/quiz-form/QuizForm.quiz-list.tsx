'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/core/components';
import { FormField } from '@/core/components';
import { Input } from '@/core/components';

import { quizSchema, type QuizFormValues } from '@/core/schemas';

interface QuizFormBuilderProps {
  onSubmit: (values: QuizFormValues) => void;
  isPending?: boolean;
  defaultValues?: Partial<QuizFormValues>;
  titleLabel: string;
  titlePlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  timeLimitLabel: string;
  submitLabel: string;
  submittingLabel: string;
}

export function QuizFormBuilder({
  onSubmit,
  isPending,
  defaultValues,
  titleLabel,
  titlePlaceholder,
  descriptionLabel,
  descriptionPlaceholder,
  timeLimitLabel,
  submitLabel,
  submittingLabel,
}: QuizFormBuilderProps) {
  const { control, handleSubmit } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      timeLimitSeconds: 300,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        name="title"
        control={control}
        label={titleLabel}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            placeholder={titlePlaceholder}
            disabled={isPending}
            aria-invalid={!!fieldState.error}
          />
        )}
      />

      <FormField
        name="description"
        control={control}
        label={descriptionLabel}
        render={({ field, fieldState }) => (
          <textarea
            {...field}
            placeholder={descriptionPlaceholder}
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
        label={timeLimitLabel}
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
        {isPending ? submittingLabel : submitLabel}
      </Button>
    </form>
  );
}
