import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { SubmitResult } from '@/core/api/generated/quizMakerAPI.schemas';

type PlayerPhase = 'playing' | 'completed';

interface PlayerStore {
  // Quiz state
  attemptId: number | null;
  quizId: number | null;
  currentQuestionIndex: number;
  answers: Record<number, string>; // questionId -> answer

  // Phase management
  phase: PlayerPhase;
  submitResult: SubmitResult | null;

  // Actions
  setAttemptId: (id: number | null) => void;
  setQuizId: (id: number | null) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: number, value: string) => void;

  goToNext: (totalQuestions: number) => void;
  goToPrevious: () => void;

  // Phase actions
  setPhaseCompleted: (result: SubmitResult) => void;
  setPhasePlayin: () => void;

  resetPlayer: () => void;
}

export const usePlayerStore = create<PlayerStore>()(
  devtools(
    (set, get) => ({
      attemptId: null,
      quizId: null,
      currentQuestionIndex: 0,
      answers: {},
      phase: 'playing',
      submitResult: null,

      setAttemptId: (id) => set({ attemptId: id }),
      setQuizId: (id) => set({ quizId: id }),
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      setAnswer: (questionId, value) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: value },
        })),

      goToNext: (totalQuestions) =>
        set((state) => ({
          currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, totalQuestions - 1),
        })),

      goToPrevious: () =>
        set((state) => ({
          currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
        })),

      setPhaseCompleted: (result) =>
        set({ phase: 'completed', submitResult: result }),

      setPhasePlayin: () => set({ phase: 'playing', submitResult: null }),

      resetPlayer: () =>
        set({
          attemptId: null,
          quizId: null,
          currentQuestionIndex: 0,
          answers: {},
          phase: 'playing',
          submitResult: null,
        }),
    }),
    { name: 'QuizPlayerStore' },
  ),
);
