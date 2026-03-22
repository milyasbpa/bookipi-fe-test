'use client';

import { useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  remainingSeconds: number | null;
  onTick: (newSeconds: number) => void;
  onTimeUp: () => void;
  timeRemainingLabel: string;
}

/**
 * CountdownTimer Component (Stateless)
 * 
 * Pure presentational component - handles countdown display and timing logic
 * NO store, NO API, NO translations
 * All actions via callbacks
 */
export function CountdownTimer({
  remainingSeconds,
  onTick,
  onTimeUp,
  timeRemainingLabel,
}: CountdownTimerProps) {
  // Countdown logic
  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds < 0) {
      return;
    }

    // Auto-submit when time's up
    if (remainingSeconds === 0) {
      onTimeUp();
      return;
    }

    // Countdown every second
    const interval = setInterval(() => {
      onTick(Math.max(0, remainingSeconds - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds, onTick, onTimeUp]);

  // Don't render if no time remaining data
  if (remainingSeconds === null || remainingSeconds < 0) {
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
        {timeRemainingLabel}: <strong>{formatTime(remainingSeconds)}</strong>
      </span>
    </div>
  );
}
