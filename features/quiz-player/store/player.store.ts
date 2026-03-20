import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface PlayerStore {
  attemptId: number | null;
  currentQuestionIndex: number;
  answers: Record<number, string>; // questionId -> answer

  setAttemptId: (id: number | null) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: number, value: string) => void;

  goToNext: (totalQuestions: number) => void;
  goToPrevious: () => void;

  resetPlayer: () => void;
}

export const usePlayerStore = create<PlayerStore>()(
  devtools(
    (set, get) => ({
      attemptId: null,
      currentQuestionIndex: 0,
      answers: {},

      setAttemptId: (id) => set({ attemptId: id }),
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

      resetPlayer: () =>
        set({
          attemptId: null,
          currentQuestionIndex: 0,
          answers: {},
        }),
    }),
    { name: 'QuizPlayerStore' },
  ),
);
