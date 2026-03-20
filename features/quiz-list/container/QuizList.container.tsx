'use client';

import { useTranslations } from 'next-intl';

import { List } from '../sections/list';
import { Create } from '../sections/create-quiz';
import { Edit } from '../sections/edit-quiz';

/**
 * QuizListContainer - Quiz List Feature Container
 *
 * Architecture: Container → Sections → Components
 * - NO props, NO state, NO business logic
 * - Only responsible for layout and rendering sections
 * - Sections handle API integration and state management
 * 
 * Flow:
 * 1. List section - Main section showing all quizzes (stateful)
 * 2. Create quiz section - Modal for creating new quiz with questions (stateful)
 * 3. Edit quiz section - Modal for editing quiz (stateful)
 */
export function QuizListContainer() {
  const t = useTranslations('quiz-maker.builder');

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t('page-title')}</h1>
        <p className="text-muted-foreground mt-1">{t('page-subtitle')}</p>
      </div>

      {/* Main Content: Quiz List */}
      <List />

      {/* Modals */}
      <Create />
      <Edit />
    </div>
  );
}
