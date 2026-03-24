'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useCreateQuestion as useCreateQuestionGenerated } from '@/core/api/generated/questions/questions';
import { Button } from '@/core/components';
import { ROUTES } from '@/core/lib/routes';

import { QuestionForm } from '../../components/question-form';
import { useCreateQuiz } from '../../react-query';
import { useQuizCreateStore, type Question } from '../../store/quiz-create.store';

export function AddQuestions() {
  const t = useTranslations('quiz-maker.builder');
  const router = useRouter();
  const { quizMetadata, questions, prevStep, addQuestion, removeQuestion, reset } =
    useQuizCreateStore();
  const createQuiz = useCreateQuiz();
  const createQuestion = useCreateQuestionGenerated();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddQuestion = (question: Question) => {
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
      const quiz = await createQuiz.mutateAsync({
        data: { ...quizMetadata!, isPublished: true },
      });
      const quizId = quiz.id!;

      await Promise.all(questions.map((q) => createQuestion.mutateAsync({ id: quizId, data: q })));

      toast.success(
        t('quiz-created-successfully', {
          id: quizId,
          count: questions.length,
        }),
      );

      reset();
      router.push(ROUTES.QUIZ_LIST);
    } catch {
      toast.error(t('failed-to-create-quiz'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-24">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('add-questions')}</h1>
        <p className="text-muted-foreground">{t('create-quiz-wizard-step-2-description')}</p>
      </div>

      <QuestionForm
        onAdd={handleAddQuestion}
        addQuestionTitle={t('add-question')}
        questionTypeLabel={t('question-type')}
        multipleChoiceLabel={t('multiple-choice')}
        shortAnswerLabel={t('short-answer')}
        questionPromptLabel={t('question-prompt')}
        enterQuestionPlaceholder={t('enter-your-question')}
        optionsLabel={t('options')}
        correctAnswerLabel={t('correct-answer')}
        correctAnswerPlaceholder={t('correct-answer-text')}
        addOptionButton={t('add-option-button')}
        optionPlaceholder={t('add-option-placeholder')}
        selectCorrectHint={t('select-correct-hint')}
        addQuestionButton={t('add-question-button')}
      />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {t('questions-list')} ({questions.length})
        </h2>
        {questions.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            {t('no-questions-added')}
          </p>
        ) : (
          <div className="space-y-2">
            {questions.map((q, index) => (
              <div key={index} className="flex items-start gap-2 rounded-lg border p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">#{index + 1}</span>
                    <span className="text-muted-foreground text-xs uppercase">{q.type}</span>
                  </div>
                  <p className="mt-1 text-sm">{q.prompt}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(index)}
                  disabled={isSubmitting}
                >
                  <Trash2 className="text-destructive size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-background fixed right-0 bottom-0 left-0 border-t p-4">
        <div className="mx-auto flex max-w-4xl gap-2">
          <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
            ← {t('back')}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitQuiz}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? t('creating-quiz') : t('submit-quiz', { count: questions.length })}
          </Button>
        </div>
      </div>
    </div>
  );
}
