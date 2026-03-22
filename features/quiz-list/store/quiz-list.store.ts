import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useCreateWizardStore } from './create-wizard.store';

interface QuizListStore {
  // Current quiz being edited
  currentQuizId: number | null;
  setCurrentQuizId: (id: number | null) => void;

  questionCount: number;
  setQuestionCount: (count: number) => void;

  // Modal state
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;

  // Selected quiz for editing
  editQuizId: number | null;
  editQuizData: { title: string; description: string; timeLimitSeconds?: number } | null;

  // Modal actions
  openCreateModal: () => void;
  closeCreateModal: () => void;

  openEditModal: (quizId: number, quizData: { title: string; description: string; timeLimitSeconds?: number }) => void;
  closeEditModal: () => void;

  resetBuilder: () => void;
}

export const useQuizListStore = create<QuizListStore>()(
  devtools(
    (set) => ({
      currentQuizId: null,
      questionCount: 0,
      isCreateModalOpen: false,
      isEditModalOpen: false,
      editQuizId: null,
      editQuizData: null,

      setCurrentQuizId: (id) => set({ currentQuizId: id }),
      setQuestionCount: (count) => set({ questionCount: count }),

      openCreateModal: () => {
        set({ isCreateModalOpen: true });
        useCreateWizardStore.getState().openWizard();
      },
      closeCreateModal: () => {
        set({ isCreateModalOpen: false });
        useCreateWizardStore.getState().closeWizard();
      },

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
          isEditModalOpen: false,
          editQuizId: null,
          editQuizData: null,
        }),
    }),
    { name: 'QuizBuilderStore' },
  ),
);
