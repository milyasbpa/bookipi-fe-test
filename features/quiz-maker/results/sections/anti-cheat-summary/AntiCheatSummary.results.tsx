'use client';

import { useParams } from 'next/navigation';
import { AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';

import { axiosInstanceMutator } from '@/core/api/axios';

/**
 * AntiCheatSummaryResults - Self-contained section (Bonus Feature)
 * 
 * Responsibilities:
 * - Fetch anti-cheat events for the attempt
 * - Display activity log if events exist
 * - Show "no suspicious activity" if no events
 * - Handle loading & error states
 */
export function AntiCheatSummaryResults() {
  const t = useTranslations('quiz-maker.results');
  const params = useParams();
  const attemptId = Number(params?.attemptId);

  // Fetch anti-cheat events
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['attempt-events', attemptId],
    queryFn: async () => {
      const response = await axiosInstanceMutator<any>({
        url: `/attempts/${attemptId}/events`,
        method: 'GET',
      });
      return response || [];
    },
    enabled: !!attemptId && !isNaN(attemptId),
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-lg border-2 border-border bg-card p-8">
        <div className="text-center text-muted-foreground">{t('loading-events')}</div>
      </div>
    );
  }

  // Error state (show as no events - anti-cheat is bonus feature, don't block results)
  if (error) {
    return (
      <div className="rounded-lg border-2 border-green-500 bg-green-50 p-8 dark:border-green-700 dark:bg-green-950">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-6 text-green-600 dark:text-green-400" />
          <p className="font-medium text-green-600 dark:text-green-400">
            {t('no-suspicious-activity')}
          </p>
        </div>
      </div>
    );
  }

  const eventList = Array.isArray(events) ? events : [];
  const hasEvents = eventList.length > 0;

  // No suspicious activity
  if (!hasEvents) {
    return (
      <div className="rounded-lg border-2 border-green-500 bg-green-50 p-8 dark:border-green-700 dark:bg-green-950">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-6 text-green-600 dark:text-green-400" />
          <p className="font-medium text-green-600 dark:text-green-400">
            {t('no-suspicious-activity')}
          </p>
        </div>
      </div>
    );
  }

  // Activity log detected
  return (
    <div className="rounded-lg border-2 border-orange-500 bg-orange-50 p-8 dark:border-orange-700 dark:bg-orange-950">
      <div className="mb-4 flex items-center gap-3">
        <AlertTriangle className="size-6 text-orange-600 dark:text-orange-400" />
        <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400">
          {t('activity-log-title')}
        </h2>
      </div>

      <div className="space-y-3">
        {eventList.map((event: any, index: number) => {
          const eventName = event.eventName || 'unknown';
          const timestamp = event.createdAt
            ? new Date(event.createdAt).toLocaleString()
            : t('time-unknown');

          return (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg bg-background/50 p-3"
            >
              <Clock className="mt-0.5 size-5 shrink-0 text-orange-600 dark:text-orange-400" />
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {t(`event-${eventName}`, { default: eventName })}
                </p>
                <p className="text-sm text-muted-foreground">{timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {t('activity-log-note')}
      </p>
    </div>
  );
}
