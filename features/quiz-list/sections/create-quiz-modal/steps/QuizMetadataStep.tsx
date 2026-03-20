'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { Button } from '@/core/components/button';
import { FormField, Input } from '@/core/components';
import { useCreateWizardStore } from '../../../store/create-wizard.store';
import {
  quizSchema,
  type QuizFormValues,
} from '../../quiz-form/quiz-form.builder.schema';

export function QuizMetadataStep() {
  const t = useTranslations('quiz-maker.builder');
  const { quizMetadata, nextStep } = useCreateWizardStore();

  const { control, handleSubmit } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: quizMetadata || {
      title: '',
      description: '',
      timeLimitSeconds: 300,
    },
  });

  const onNext = (values: QuizFormValues) => {
    nextStep(values);
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <FormField
        name="title"
        control={control}
        label={t('title-label')}
        render={({ field }) => (
          <Input {...field} placeholder={t('title-placeholder')} />
        )}
      />

      <FormField
        name="description"
        control={control}
        label={t('description-label')}
        render={({ field }) => (
          <textarea
            {...field}
            placeholder={t('description-placeholder')}
            className="w-full rounded-xl border p-4"
            rows={3}
          />
        )}
      />

      <FormField
        name="timeLimitSeconds"
        control={control}
        label={t('time-limit-label')}
        render={({ field }) => (
          <Input
            {...field}
            value={field.value ?? ''}
            type="number"
            min={60}
            max={7200}
            onChange={(e) => field.onChange(e.target.valueAsNumber || null)}
          />
        )}
      />

      <Button type="submit" variant="primary" size="lg" className="w-full">
        {t('next-add-questions')} →
      </Button>
    </form>
  );
}
