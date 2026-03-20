import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BuilderStore {
  // Current quiz being edited
  currentQuizId: number | null;
  setCurrentQuizId: (id: number | null) => void;

  questionCount: number;
  setQuestionCount: (count: number) => void;

  // Modal state
  isCreateModalOpen: boolean;
  isAddQuestionModalOpen: boolean;

  // Selected quiz for adding questions
  selectedQuizId: number | null;
  selectedQuizTitle: string | null;

  // Modal actions
  openCreateModal: () => void;
  closeCreateModal: () => void;

  openAddQuestionModal: (quizId: number, quizTitle: string) => void;
  closeAddQuestionModal: () => void;

  resetBuilder: () => void;
}

export const useBuilderStore = create<BuilderStore>()(
  devtools(
    (set) => ({
      currentQuizId: null,
      questionCount: 0,
      isCreateModalOpen: false,
      isAddQuestionModalOpen: false,
      selectedQuizId: null,
      selectedQuizTitle: null,

      setCurrentQuizId: (id) => set({ currentQuizId: id }),
      setQuestionCount: (count) => set({ questionCount: count }),

      openCreateModal: () => set({ isCreateModalOpen: true }),
      closeCreateModal: () => set({ isCreateModalOpen: false }),

      openAddQuestionModal: (quizId, quizTitle) =>
        set({
          isAddQuestionModalOpen: true,
          selectedQuizId: quizId,
          selectedQuizTitle: quizTitle,
        }),
      closeAddQuestionModal: () =>
        set({
          isAddQuestionModalOpen: false,
          selectedQuizId: null,
          selectedQuizTitle: null,
        }),

      resetBuilder: () =>
        set({
          currentQuizId: null,
          questionCount: 0,
          isCreateModalOpen: false,
          isAddQuestionModalOpen: false,
          selectedQuizId: null,
          selectedQuizTitle: null,
        }),
    }),
    { name: 'QuizBuilderStore' },
  ),
);
