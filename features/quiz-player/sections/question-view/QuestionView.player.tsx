'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { MCQAnswer } from '../../components/mcq-answer/MCQAnswer';
import { ShortAnswer } from '../../components/short-answer/ShortAnswer';
import { usePlayerStore } from '../../store/player.store';
import { useGetQuizPlayer } from '../../react-query';

/**
 * QuestionViewPlayer - Self-contained section
 * 
 * Responsibilities:
 * - Access current question from quiz data + Zustand currentQuestionIndex
 * - Render appropriate component based on question type (MCQ/Short/Code)
 * - Handle answer changes via Zustand only (no auto-save)
 * - Answers saved to API only on submit
 */
export function QuestionViewPlayer() {
  const t = useTranslations('quiz-maker.player');
  const params = useParams();
  const quizId = Number(params?.quizId);

  const attemptId = usePlayerStore((s) => s.attemptId);
  const currentQuestionIndex = usePlayerStore((s) => s.currentQuestionIndex);
  const answers = usePlayerStore((s) => s.answers);
  const setAnswer = usePlayerStore((s) => s.setAnswer);

  // Fetch quiz to get questions
  const { data: quiz } = useGetQuizPlayer(quizId, {
    enabled: !!quizId && !isNaN(quizId) && !!attemptId,
  });

  // Don't render until we have quiz data and attemptId
  if (!quiz || !attemptId || !quiz.questions || quiz.questions.length === 0) {
    return null;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  if (!currentQuestion) {
    return null;
  }

  const currentAnswer = currentQuestion.id ? answers[currentQuestion.id] || '' : '';

  const handleAnswerChange = (value: string) => {
    if (!currentQuestion.id) return;

    // Only update local Zustand state
    // No API call - answers will be saved on submit
    setAnswer(currentQuestion.id, value);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            {t('question')} {currentQuestionIndex + 1} {t('of')} {totalQuestions}
          </h2>
          <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-accent">
            {currentQuestion.type?.toUpperCase() || t('type-na')}
          </span>
        </div>

        <p className="text-lg text-foreground">{currentQuestion.prompt}</p>
      </div>

      <div>
        {currentQuestion.type === 'mcq' && currentQuestion.options && (
          <MCQAnswer
            options={currentQuestion.options}
            selectedValue={currentAnswer}
            onChange={handleAnswerChange}
          />
        )}

        {currentQuestion.type === 'short' && (
          <ShortAnswer
            value={currentAnswer}
            onChange={handleAnswerChange}
            placeholder={t('answer-placeholder')}
          />
        )}

        {currentQuestion.type === 'code' && (
          <ShortAnswer
            value={currentAnswer}
            onChange={handleAnswerChange}
            placeholder={t('code-placeholder')}
          />
        )}
      </div>
    </div>
  );
}
