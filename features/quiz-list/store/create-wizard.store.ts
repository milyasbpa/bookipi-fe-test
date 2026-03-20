import { create } from 'zustand';

interface QuizMetadata {
  title: string;
  description: string;
  timeLimitSeconds?: number | null;
  isPublished?: boolean;
}

interface Question {
  type: 'mcq' | 'short' | 'code';
  prompt: string;
  options?: string[];
  correctAnswer: string | number;
}

interface CreateWizardStore {
  // Modal state
  isOpen: boolean;
  currentStep: 1 | 2;

  // Step 1 data
  quizMetadata: QuizMetadata | null;

  // Step 2 data
  questions: Question[];

  // Actions
  openWizard: () => void;
  closeWizard: () => void;
  nextStep: (metadata: QuizMetadata) => void;
  prevStep: () => void;
  addQuestion: (question: Question) => void;
  removeQuestion: (index: number) => void;
  resetWizard: () => void;
}

export const useCreateWizardStore = create<CreateWizardStore>((set) => ({
  isOpen: false,
  currentStep: 1,
  quizMetadata: null,
  questions: [],

  openWizard: () => set({ isOpen: true, currentStep: 1 }),
  closeWizard: () => set({ isOpen: false }),
  nextStep: (metadata) =>
    set({
      currentStep: 2,
      quizMetadata: metadata,
    }),
  prevStep: () => set({ currentStep: 1 }),
  addQuestion: (question) =>
    set((state) => ({
      questions: [...state.questions, question],
    })),
  removeQuestion: (index) =>
    set((state) => ({
      questions: state.questions.filter((_, i) => i !== index),
    })),
  resetWizard: () =>
    set({
      currentStep: 1,
      quizMetadata: null,
      questions: [],
    }),
}));
