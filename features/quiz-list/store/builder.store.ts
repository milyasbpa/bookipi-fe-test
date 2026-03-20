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
  isEditModalOpen: boolean;

  // Selected quiz for adding questions
  selectedQuizId: number | null;
  selectedQuizTitle: string | null;

  // Selected quiz for editing
  editQuizId: number | null;
  editQuizData: { title: string; description: string; timeLimitSeconds?: number } | null;

  // Modal actions
  openCreateModal: () => void;
  closeCreateModal: () => void;

  openAddQuestionModal: (quizId: number, quizTitle: string) => void;
  closeAddQuestionModal: () => void;

  openEditModal: (quizId: number, quizData: { title: string; description: string; timeLimitSeconds?: number }) => void;
  closeEditModal: () => void;

  resetBuilder: () => void;
}

export const useBuilderStore = create<BuilderStore>()(
  devtools(
    (set) => ({
      currentQuizId: null,
      questionCount: 0,
      isCreateModalOpen: false,
      isAddQuestionModalOpen: false,
      isEditModalOpen: false,
      selectedQuizId: null,
      selectedQuizTitle: null,
      editQuizId: null,
      editQuizData: null,

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

      openEditModal: (quizId, quizData) =>
        set({
          isEditModalOpen: true,
          editQuizId: quizId,
          editQuizData: quizData,
        }),
      closeEditModal: () =>
        set({
          isEditModalOpen: false,
          editQuizId: null,
          editQuizData: null,
        }),

      resetBuilder: () =>
        set({
          currentQuizId: null,
          questionCount: 0,
          isCreateModalOpen: false,
          isAddQuestionModalOpen: false,
          isEditModalOpen: false,
          selectedQuizId: null,
          selectedQuizTitle: null,
          editQuizId: null,
          editQuizData: null,
        }),
    }),
    { name: 'QuizBuilderStore' },
  ),
);
