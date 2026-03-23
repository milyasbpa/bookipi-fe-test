'use client';

import { usePlayerStore } from '../store/player.store';
import { QuizHeaderPlayer } from '../sections/quiz-header/QuizHeader.player';
import { QuestionViewPlayer } from '../sections/question-view/QuestionView.player';
import { NavigationPlayer } from '../sections/navigation/Navigation.player';
import { ScoreCardPlayer } from '../sections/results-score-card';
import { QuestionBreakdownPlayer } from '../sections/results-question-breakdown';
import { AntiCheatSummaryPlayer } from '../sections/results-anti-cheat-summary';
import { ResultsFooter } from '../sections/results-footer';

export function PlayerContainer() {
  const phase = usePlayerStore((s) => s.phase);

  if (phase === 'playing') {
    return (
      <div className="container mx-auto max-w-4xl space-y-8 p-6">
        <QuizHeaderPlayer />
        <QuestionViewPlayer />
        <NavigationPlayer />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      <ScoreCardPlayer />
      <QuestionBreakdownPlayer />
      <AntiCheatSummaryPlayer />
      <ResultsFooter />
    </div>
  );
}
