'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button, Dialog, FormField, Input } from '@/core/components';
import { StepIndicator } from '../../components/step-indicator';
import { QuestionForm } from '../../components/question-form';
import { QuestionsList } from '../../components/questions-list';
import { useCreateWizardStore } from '../../store/create-wizard.store';
import { useCreateQuiz } from '../../react-query/use-create-quiz';
import { useCreateQuestion } from '../../react-query/use-create-question';
import {
  quizSchema,
  type QuizFormValues,
} from '../../components/quiz-form/quiz-form.builder.schema';
import { ROUTES } from '@/core/lib/routes';

/**
 * Create Quiz Section
 * 
 * Stateful wizard logic for creating quiz with questions
 * - Manages 2-step flow
 * - Step 1: Quiz metadata (title, description, time limit)
 * - Step 2: Add questions
 * - Integrates with API (createQuiz, createQuestion)
 * - Drills props down to stateless components
 */
export function Create() {
  const t = useTranslations('quiz-maker.builder');
  const router = useRouter();
  const {
    isOpen,
    closeWizard,
    currentStep,
    quizMetadata,
    questions,
    nextStep,
    prevStep,
    addQuestion,
    resetWizard,
  } = useCreateWizardStore();
  const createQuiz = useCreateQuiz();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Quiz metadata form
  const { control, handleSubmit } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: quizMetadata || {
      title: '',
      description: '',
      timeLimitSeconds: 300,
    },
  });

  const onNextStep = (values: QuizFormValues) => {
    nextStep(values);
  };

  // Step 2: Add question handler
  const handleAddQuestion = (question: any) => {
    addQuestion(question);
    toast.success(t('question-added'));
  };

  // Step 2: Submit quiz with questions
  const handleSubmitQuiz = async () => {
    if (questions.length === 0) {
      toast.error(t('add-at-least-one-question'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Create quiz
      const quiz = await createQuiz.mutateAsync({ data: quizMetadata! });
      const quizId = quiz.id!;

      // Add all questions
      const createQuestionMutation = useCreateQuestion(quizId);
      await Promise.all(
        questions.map((q) =>
          createQuestionMutation.mutateAsync({ id: quizId, data: q })
        )
      );

      // Success
      toast.success(
        t('quiz-created-successfully', {
          id: quizId,
          count: questions.length,
        })
      );

      resetWizard();
      closeWizard();
      router.push(ROUTES.QUIZ_LIST);
    } catch (error) {
      toast.error(t('failed-to-create-quiz'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeWizard}
      title={t('create-quiz-wizard-title')}
      description={t(`create-quiz-wizard-step-${currentStep}-description`)}
      size="lg"
    >
      <div className="space-y-4">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={2} />

        {/* Step 1: Quiz Metadata */}
        {currentStep === 1 && (
          <form onSubmit={handleSubmit(onNextStep)} className="space-y-4">
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
        )}

        {/* Step 2: Add Questions */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Question Form - stateless component */}
            <QuestionForm onAdd={handleAddQuestion} />

            {/* Questions List - stateless component */}
            <QuestionsList />

            {/* Actions */}
            <div className="flex gap-2 border-t pt-4">
              <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
                ← {t('back')}
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitQuiz}
                disabled={isSubmitting || questions.length === 0}
                className="flex-1"
              >
                {isSubmitting
                  ? t('creating-quiz')
                  : t('submit-quiz', { count: questions.length })}
              </Button>
            </div>

            {questions.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {t('no-questions-added')}
              </p>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
}
