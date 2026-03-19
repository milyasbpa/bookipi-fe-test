'use client';

import { useTranslations } from 'next-intl';

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
  const t = useTranslations('quiz-maker.builder');

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">{t('page-title')}</h1>
        <p className="text-muted-foreground mt-1">{t('page-subtitle')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold">{t('step-1-title')}</h2>
          <QuizFormBuilder />
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">{t('step-2-title')}</h2>
          <QuestionFormBuilder />
        </div>
      </div>

      <div>
        <QuestionListBuilder />
      </div>
    </div>
  );
}
