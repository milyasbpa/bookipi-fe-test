'use client';

import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function AntiCheatSummaryPlayer() {
  const t = useTranslations('quiz-maker.results');

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
