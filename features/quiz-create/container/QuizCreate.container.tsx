'use client';

import { useQuizCreateStore } from '../store/quiz-create.store';
import { QuizInfo } from '../sections/quiz-info';
import { AddQuestions } from '../sections/add-questions';
import { StepIndicator } from '@/core/components';

export function QuizCreateContainer() {
  const { currentStep } = useQuizCreateStore();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <StepIndicator currentStep={currentStep} totalSteps={2} />

        {currentStep === 1 && <QuizInfo />}
        {currentStep === 2 && <AddQuestions />}
      </div>
    </div>
  );
}
