'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';

import { Button } from '@/core/components';
import { FormField } from '@/core/components';
import { Input } from '@/core/components';
import { MCQOptions } from '../../components/mcq-options/MCQOptions';
import { useCreateQuestion } from '../../react-query/use-create-question';

import { questionSchema, type QuestionFormValues } from './question-form.builder.schema';

interface QuestionFormBuilderProps {
  quizId: number;
}

export function QuestionFormBuilder({ quizId }: QuestionFormBuilderProps) {
  const t = useTranslations('quiz-maker.builder');
  const { mutate, isPending } = useCreateQuestion(quizId);

  const { control, handleSubmit, watch, reset, setValue } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      type: 'mcq',
      prompt: '',
      options: ['', ''],
      correctAnswer: '',
    },
  });

  const questionType = watch('type');
  const currentOptions = watch('options');

  const onSubmit = (values: QuestionFormValues) => {
    mutate(
      { id: quizId, data: values },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        name="type"
        control={control}
        label={t('question-type')}
        render={({ field }) => (
          <select
            {...field}
            className="w-full rounded-xl border border-border bg-transparent p-3 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring disabled:opacity-50"
            disabled={isPending}
          >
            <option value="mcq">{t('question-type-mcq')}</option>
            <option value="short">{t('question-type-short')}</option>
            <option value="code">{t('question-type-code')}</option>
          </select>
        )}
      />

      <FormField
        name="prompt"
        control={control}
        label={t('question-prompt')}
        render={({ field, fieldState }) => (
          <textarea
            {...field}
            placeholder={t('prompt-placeholder')}
            className="w-full rounded-xl border border-border bg-transparent p-4 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring disabled:opacity-50"
            rows={2}
            disabled={isPending}
            aria-invalid={!!fieldState.error}
          />
        )}
      />

      {questionType === 'mcq' && (
        <Controller
          name="options"
          control={control}
          render={({ field }) => (
            <MCQOptions
              options={field.value || []}
              onChange={field.onChange}
              selectedCorrectIndex={watch('correctAnswer') as number}
              onSelectCorrect={(index) => {
                setValue('correctAnswer', index);
              }}
              disabled={isPending}
            />
          )}
        />
      )}

      {questionType === 'short' && (
        <FormField
          name="correctAnswer"
          control={control}
          label={t('correct-answer')}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              value={(field.value as string) || ''}
              placeholder={t('answer-placeholder')}
              disabled={isPending}
              aria-invalid={!!fieldState.error}
            />
          )}
        />
      )}

      <Button type="submit" variant="primary" disabled={isPending} className="w-full">
        {isPending ? t('adding') : t('add-question')}
      </Button>
    </form>
  );
}
