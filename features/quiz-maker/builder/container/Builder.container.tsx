'use client';

import { QuizFormBuilder } from '../sections/quiz-form/QuizForm.builder';
import { QuestionFormBuilder } from '../sections/question-form/QuestionForm.builder';
import { QuestionListBuilder } from '../sections/question-list/QuestionList.builder';

/**
 * BuilderContainer - Quiz Builder Feature Container
 *
 * Architecture: Container → Sections → Components
 * - NO props, NO state, NO business logic
 * - Only responsible for layout and rendering sections
 * - Sections handle API integration and state management
 */
export function BuilderContainer() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Quiz Builder</h1>
        <p className="text-muted-foreground mt-1">Create a new quiz and add questions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Step 1: Create Quiz</h2>
          <QuizFormBuilder />
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Step 2: Add Questions</h2>
          <QuestionFormBuilder />
        </div>
      </div>

      <div>
        <QuestionListBuilder />
      </div>
    </div>
  );
}
