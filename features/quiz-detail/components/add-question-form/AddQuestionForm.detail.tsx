'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import { Button } from '@/core/components';
import { FormField } from '@/core/components';
import { Input } from '@/core/components';
import { MCQOptions } from '@/core/components';

import { questionSchema, type QuestionFormValues } from '../../schemas/add-question-form.schema';

interface AddQuestionFormProps {
  onSubmit: (values: QuestionFormValues, reset: () => void) => void;
  isPending?: boolean;
  
  // Labels
  questionTypeLabel: string;
  questionTypeMcq: string;
  questionTypeShort: string;
  questionTypeCode: string;
  questionPromptLabel: string;
  promptPlaceholder: string;
  correctAnswerLabel: string;
  answerPlaceholder: string;
  addOptionButton: string;
  optionPlaceholder: string;
  selectCorrectHint: string;
  addButtonLabel: string;
  addingLabel: string;
}

/**
 * AddQuestionForm Component (Stateless)
 * 
 * Pure presentational component - accepts all data via props
 * NO API calls, NO translations, NO store
 */
export function AddQuestionForm({
  onSubmit,
  isPending = false,
  questionTypeLabel,
  questionTypeMcq,
  questionTypeShort,
  questionTypeCode,
  questionPromptLabel,
  promptPlaceholder,
  correctAnswerLabel,
  answerPlaceholder,
  addOptionButton,
  optionPlaceholder,
  selectCorrectHint,
  addButtonLabel,
  addingLabel,
}: AddQuestionFormProps) {
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

  const handleFormSubmit = (values: QuestionFormValues) => {
    onSubmit(values, reset);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <FormField
        name="type"
        control={control}
        label={questionTypeLabel}
        render={({ field }) => (
          <select
            {...field}
            className="w-full rounded-xl border border-border bg-transparent p-3 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring disabled:opacity-50"
            disabled={isPending}
          >
            <option value="mcq">{questionTypeMcq}</option>
            <option value="short">{questionTypeShort}</option>
            <option value="code">{questionTypeCode}</option>
          </select>
        )}
      />

      <FormField
        name="prompt"
        control={control}
        label={questionPromptLabel}
        render={({ field, fieldState }) => (
          <textarea
            {...field}
            placeholder={promptPlaceholder}
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
              addOptionButtonLabel={addOptionButton}
              optionPlaceholder={optionPlaceholder}
              selectCorrectHint={selectCorrectHint}
            />
          )}
        />
      )}

      {questionType === 'short' && (
        <FormField
          name="correctAnswer"
          control={control}
          label={correctAnswerLabel}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              value={(field.value as string) || ''}
              placeholder={answerPlaceholder}
              disabled={isPending}
              aria-invalid={!!fieldState.error}
            />
          )}
        />
      )}

      <Button type="submit" variant="primary" disabled={isPending} className="w-full">
        {isPending ? addingLabel : addButtonLabel}
      </Button>
    </form>
  );
}
