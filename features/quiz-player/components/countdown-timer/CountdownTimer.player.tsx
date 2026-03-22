'use client';

import { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { usePlayerStore } from '../../store/player.store';
import { useSubmitAttempt } from '../../react-query';

interface CountdownTimerProps {
  timeLimitSeconds: number;
  attemptId: number;
  quizId: number;
}

/**
 * CountdownTimer - Real-time countdown timer
 * 
 * Responsibilities:
 * - Initialize timer from timeLimitSeconds
 * - Countdown every second
 * - Auto-submit when time reaches 0
 * - Display in MM:SS format
 */
export function CountdownTimer({ timeLimitSeconds, attemptId, quizId }: CountdownTimerProps) {
  const t = useTranslations('quiz-maker.player');
  const remainingSeconds = usePlayerStore((s) => s.remainingSeconds);
  const setRemainingSeconds = usePlayerStore((s) => s.setRemainingSeconds);
  const phase = usePlayerStore((s) => s.phase);

  const { mutate: submitAttempt } = useSubmitAttempt(attemptId, quizId);

  // Initialize timer when component mounts
  useEffect(() => {
    if (phase === 'playing' && remainingSeconds === null) {
      setRemainingSeconds(timeLimitSeconds);
    }
  }, [timeLimitSeconds, remainingSeconds, setRemainingSeconds, phase]);

  // Countdown logic
  useEffect(() => {
    // Only run countdown during playing phase
    if (phase !== 'playing' || remainingSeconds === null) {
      return;
    }

    // Auto-submit when time's up
    if (remainingSeconds === 0) {
      toast.info(t('time-up'));
      submitAttempt();
      return;
    }

    // Countdown every second
    const interval = setInterval(() => {
      setRemainingSeconds(Math.max(0, remainingSeconds - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds, phase, submitAttempt, setRemainingSeconds, t]);

  // Don't render if no time remaining data
  if (remainingSeconds === null) {
    return null;
  }

  // Format seconds as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 mt-4 text-sm">
      <Clock className="size-4" />
      <span>
        {t('time-remaining')}: <strong>{formatTime(remainingSeconds)}</strong>
      </span>
    </div>
  );
}
