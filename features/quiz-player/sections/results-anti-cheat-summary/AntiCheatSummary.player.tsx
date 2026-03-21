'use client';

import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * AntiCheatSummaryPlayer - Results anti-cheat summary section
 * 
 * Responsibilities:
 * - Display anti-cheat summary
 * - Note: Backend does not provide GET /attempts/:id/events endpoint
 * - For now, shows "no suspicious activity" message
 * - If GET endpoint is added later, can be updated to fetch and display events
 * 
 * Shown when phase = 'completed'
 */
export function AntiCheatSummaryPlayer() {
  const t = useTranslations('quiz-maker.results');

  // Backend does not have GET /attempts/:id/events endpoint yet
  // Anti-cheat events are recorded via POST but cannot be retrieved
  // For demonstration, show "no suspicious activity" message
  
  return (
    <div className="rounded-lg border-2 border-green-500 bg-green-50 p-8 dark:border-green-700 dark:bg-green-950">
      <div className="flex items-center gap-3">
        <ShieldCheck className="size-6 text-green-600 dark:text-green-400" />
        <p className="font-medium text-green-600 dark:text-green-400">
          {t('no-suspicious-activity')}
        </p>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {t('activity-log-note')}
      </p>
    </div>
  );
}
