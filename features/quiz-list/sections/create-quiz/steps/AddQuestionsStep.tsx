'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Button } from '@/core/components/button';
import { useCreateWizardStore } from '../../../store/create-wizard.store';
import { useCreateQuiz } from '../../../react-query/use-create-quiz';
import { useCreateQuestion } from '../../../react-query/use-create-question';
import { QuestionForm } from '../../../components/question-form';
import { QuestionsList } from '../../../components/questions-list';
import { ROUTES } from '@/core/lib/routes';

export function AddQuestionsStep() {
  const t = useTranslations('quiz-maker.builder');
  const router = useRouter();
  const {
    quizMetadata,
    questions,
    prevStep,
    addQuestion,
    resetWizard,
    closeWizard,
  } = useCreateWizardStore();
  const createQuiz = useCreateQuiz();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddQuestion = (question: any) => {
    addQuestion(question);
    toast.success(t('question-added'));
  };

  const handleSubmit = async () => {
    if (questions.length === 0) {
      toast.error(t('add-at-least-one-question'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create quiz
      const quiz = await createQuiz.mutateAsync({ data: quizMetadata! });
      const quizId = quiz.id!;

      // Step 2: Add all questions
      const createQuestionMutation = useCreateQuestion(quizId);
      await Promise.all(
        questions.map((q) =>
          createQuestionMutation.mutateAsync({ id: quizId, data: q })
        )
      );

      // Success!
      toast.success(
        t('quiz-created-successfully', {
          id: quizId,
          count: questions.length,
        })
      );

      resetWizard();
      closeWizard();

      // Navigate back to quiz list
      router.push(ROUTES.QUIZ_LIST);
    } catch (error) {
      toast.error(t('failed-to-create-quiz'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Question Form */}
      <QuestionForm onAdd={handleAddQuestion} />

      {/* Questions List */}
      <QuestionsList />

      {/* Actions */}
      <div className="flex gap-2 border-t pt-4">
        <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
          ← {t('back')}
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
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
          {t('add-at-least-one-question-hint')}
        </p>
      )}
    </div>
  );
}
