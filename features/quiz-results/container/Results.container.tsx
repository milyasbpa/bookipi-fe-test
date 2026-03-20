'use client';

import { ScoreCardResults } from '../sections/score-card';
import { QuestionBreakdownResults } from '../sections/question-breakdown';
import { AntiCheatSummaryResults } from '../sections/anti-cheat-summary';

/**
 * ResultsContainer - Quiz Results Feature Container
 * 
 * Architecture: Container → Sections → Components
 * - NO props, NO state, NO business logic, NO API calls
 * - Only responsible for layout and rendering sections
 * - Sections are self-contained and handle their own data fetching
 */
export function ResultsContainer() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      <ScoreCardResults />
      <QuestionBreakdownResults />
      <AntiCheatSummaryResults />
    </div>
  );
}
