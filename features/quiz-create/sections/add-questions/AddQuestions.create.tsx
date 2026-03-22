'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import { Button } from '@/core/components';
import { QuestionForm } from '@/features/quiz-list/components/question-form';
import { useQuizCreateStore } from '../../store/quiz-create.store';
import { useCreateQuiz } from '../../react-query';
import { useCreateQuestion } from '@/features/quiz-list/react-query/useCreateQuestion';
import { ROUTES } from '@/core/lib/routes';

/**
 * AddQuestions Section (Step 2)
 * 
 * Stateful section for adding questions to quiz
 * - Displays question form (reused from quiz-list)
 * - Shows list of added questions
 * - Handles quiz + questions submission
 * - Back button to step 1
 * - Submit button to create quiz with all questions
 */
export function AddQuestions() {
  const t = useTranslations('quiz-maker.builder');
  const router = useRouter();
  const { quizMetadata, questions, prevStep, addQuestion, removeQuestion, reset } = useQuizCreateStore();
  const createQuiz = useCreateQuiz();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddQuestion = (question: any) => {
    addQuestion(question);
    toast.success(t('question-added'));
  };

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

      reset();
      router.push(ROUTES.QUIZ_LIST);
    } catch (error) {
      toast.error(t('failed-to-create-quiz'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-24">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('add-questions')}</h1>
        <p className="text-muted-foreground">
          {t('create-quiz-wizard-step-2-description')}
        </p>
      </div>

      {/* Question Form */}
      <QuestionForm onAdd={handleAddQuestion} />

      {/* Questions List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {t('questions-list')} ({questions.length})
        </h2>
        {questions.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            {t('no-questions-added')}
          </p>
        ) : (
          <div className="space-y-2">
            {questions.map((q, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-lg border p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">#{index + 1}</span>
                    <span className="text-xs uppercase text-muted-foreground">
                      {q.type}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{q.prompt}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(index)}
                  disabled={isSubmitting}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <div className="mx-auto max-w-4xl flex gap-2">
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
      </div>
    </div>
  );
}
