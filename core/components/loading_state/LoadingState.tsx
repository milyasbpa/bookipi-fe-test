import * as React from 'react';
import { MoonLoader } from 'react-spinners';

import { cn } from '@/core/lib/utils';

export interface LoadingStateProps {
  /**
   * Loading message to display below the spinner
   */
  message?: string;
  /**
   * Size of the loader in pixels
   * @default 60
   */
  size?: number;
  /**
   * Color of the loader
   * @default 'hsl(var(--primary))'
   */
  color?: string;
  /**
   * Additional class names for the container
   */
  className?: string;
  /**
   * Minimum height for the loading container
   * @default 'min-h-100'
   */
  minHeight?: string;
}

/**
 * LoadingState Component
 * 
 * Reusable loading state with MoonLoader spinner
 * Can be used for tables, lists, or any async data loading
 * 
 * @example
 * ```tsx
 * <LoadingState message="Loading quizzes..." />
 * <LoadingState size={40} minHeight="min-h-50" />
 * ```
 */
export function LoadingState({
  message,
  size = 60,
  color = 'hsl(var(--primary))',
  className,
  minHeight = 'min-h-100',
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        minHeight,
        className,
      )}
    >
      <MoonLoader color={color} size={size} speedMultiplier={0.8} />
      {message && <p className="text-muted-foreground text-sm">{message}</p>}
    </div>
  );
}
