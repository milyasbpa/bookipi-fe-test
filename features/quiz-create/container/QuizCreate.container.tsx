'use client';

import { useQuizCreateStore } from '../store/quiz-create.store';
import { QuizInfo } from '../sections/quiz-info';
import { AddQuestions } from '../sections/add-questions';
import { StepIndicator } from '@/core/components';

/**
 * QuizCreate Container
 * 
 * Layout container for quiz creation flow
 * - Displays step indicator
 * - Switches between QuizInfo (step 1) and AddQuestions (step 2)
 * - No business logic, just layout
 */
export function QuizCreateContainer() {
  const { currentStep } = useQuizCreateStore();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={2} />

        {/* Step Content */}
        {currentStep === 1 && <QuizInfo />}
        {currentStep === 2 && <AddQuestions />}
      </div>
    </div>
  );
}
