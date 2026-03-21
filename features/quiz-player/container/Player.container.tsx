'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button } from '@/core/components';
import { ROUTES } from '@/core/lib/routes';
import { usePlayerStore } from '../store/player.store';
import { QuizHeaderPlayer } from '../sections/quiz-header/QuizHeader.player';
import { QuestionViewPlayer } from '../sections/question-view/QuestionView.player';
import { NavigationPlayer } from '../sections/navigation/Navigation.player';
import { ScoreCardPlayer } from '../sections/results-score-card';
import { QuestionBreakdownPlayer } from '../sections/results-question-breakdown';
import { AntiCheatSummaryPlayer } from '../sections/results-anti-cheat-summary';

/**
 * PlayerContainer - Quiz Player Feature Container
 * 
 * Architecture: Container → Sections → Components
 * - NO props, NO state, NO business logic
 * - Only responsible for layout and rendering sections
 * - Sections handle API integration and state management
 * 
 * Phases:
 * - 'playing': Shows quiz header, question view, navigation
 * - 'completed': Shows results (score card, breakdown, anti-cheat)
 */
export function PlayerContainer() {
  const router = useRouter();
  const t = useTranslations('quiz-maker.results');
  const phase = usePlayerStore((s) => s.phase);

  // Playing phase: Quiz taking interface
  if (phase === 'playing') {
    return (
      <div className="container mx-auto max-w-4xl space-y-8 p-6">
        <QuizHeaderPlayer />
        <QuestionViewPlayer />
        <NavigationPlayer />
      </div>
    );
  }

  // Completed phase: Results display
  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      <ScoreCardPlayer />
      <QuestionBreakdownPlayer />
      <AntiCheatSummaryPlayer />
      
      {/* Back to Quiz List */}
      <div className="flex justify-center">
        <Button
          onClick={() => router.push(ROUTES.QUIZ_LIST)}
          variant="outline"
          size="lg"
        >
          {t('back-to-quiz-list')}
        </Button>
      </div>
    </div>
  );
}
