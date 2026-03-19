import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { SubmitResult } from '@/core/api/generated/quizMakerAPI.schemas';

/**
 * Results Store
 * 
 * Stores the submit result (score and details) from the quiz attempt.
 * This data is set by the Player feature after successful submission.
 */
interface ResultsStore {
  // Submit result data (set by Player after submit)
  submitResult: SubmitResult | null;
  quizId: number | null;

  // Actions
  setSubmitResult: (quizId: number, result: SubmitResult) => void;
  resetResults: () => void;
}

export const useResultsStore = create<ResultsStore>()(
  devtools(
    (set) => ({
      submitResult: null,
      quizId: null,

      setSubmitResult: (quizId, result) =>
        set({ quizId, submitResult: result }, false, 'setSubmitResult'),

      resetResults: () =>
        set({ quizId: null, submitResult: null }, false, 'resetResults'),
    }),
    { name: 'ResultsStore' }
  )
);
