import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BuilderStore {
  currentQuizId: number | null;
  setCurrentQuizId: (id: number | null) => void;

  questionCount: number;
  setQuestionCount: (count: number) => void;

  resetBuilder: () => void;
}

export const useBuilderStore = create<BuilderStore>()(
  devtools(
    (set) => ({
      currentQuizId: null,
      questionCount: 0,

      setCurrentQuizId: (id) => set({ currentQuizId: id }),
      setQuestionCount: (count) => set({ questionCount: count }),

      resetBuilder: () => set({ currentQuizId: null, questionCount: 0 }),
    }),
    { name: 'QuizBuilderStore' },
  ),
);
