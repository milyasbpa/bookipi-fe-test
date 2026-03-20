'use client';

import { QuizHeader } from '../sections/quiz-header';
import { QuestionTable } from '../sections/question-table';
import { AddQuestionModal } from '../sections/add-question-modal';
import { EditQuestionModal } from '../sections/edit-question-modal';
import { Edit } from '@/features/quiz-list/sections/edit-quiz';

/**
 * QuizDetailContainer - Quiz Detail Page Container
 *
 * Architecture: Container → Sections → Components
 * - NO props, NO state, NO business logic
 * - Only responsible for layout and rendering sections
 * - Sections handle API integration and state management
 *
 * Flow:
 * 1. QuizHeader - Shows quiz metadata and navigation
 * 2. QuestionTable - Shows all questions with CRUD actions
 * 3. Modals - Add/Edit question forms, Edit quiz form
 */
export function QuizDetailContainer() {
  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      {/* Quiz Header */}
      <QuizHeader />

      {/* Questions Table */}
      <QuestionTable />

      {/* Modals */}
      <AddQuestionModal />
      <EditQuestionModal />
      <Edit />
    </div>
  );
}
