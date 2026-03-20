'use client';

import { useTranslations } from 'next-intl';

import { QuizListBuilder } from '../sections/quiz-list';
import { CreateQuizModal } from '../sections/create-quiz-modal';
import { AddQuestionModal } from '../sections/add-question-modal';
import { EditQuizModal } from '../sections/edit-quiz-modal';

/**
 * BuilderContainer - Quiz Builder Feature Container
 *
 * Architecture: Container → Sections → Components
 * - NO props, NO state, NO business logic
 * - Only responsible for layout and rendering sections
 * - Sections handle API integration and state management
 * 
 * New Flow (List-First + Modals):
 * 1. QuizListBuilder - Main section showing all quizzes
 * 2. CreateQuizModal - Modal for creating new quiz
 * 3. AddQuestionModal - Modal for adding questions to selected quiz
 */
export function BuilderContainer() {
  const t = useTranslations('quiz-maker.builder');

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t('page-title')}</h1>
        <p className="text-muted-foreground mt-1">{t('page-subtitle')}</p>
      </div>

      {/* Main Content: Quiz List */}
      <QuizListBuilder />

      {/* Modals */}
      <CreateQuizModal />
      <EditQuizModal />
      <AddQuestionModal />
    </div>
  );
}
