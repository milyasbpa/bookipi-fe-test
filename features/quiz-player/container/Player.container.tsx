'use client';

import { QuizHeaderPlayer } from '../sections/quiz-header/QuizHeader.player';
import { QuestionViewPlayer } from '../sections/question-view/QuestionView.player';
import { NavigationPlayer } from '../sections/navigation/Navigation.player';

/**
 * PlayerContainer - Quiz Player Feature Container
 * 
 * Architecture: Container → Sections → Components
 * - NO props, NO state, NO business logic
 * - Only responsible for layout and rendering sections
 * - Sections handle API integration and state management
 */
export function PlayerContainer() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      <QuizHeaderPlayer />
      <QuestionViewPlayer />
      <NavigationPlayer />
    </div>
  );
}
