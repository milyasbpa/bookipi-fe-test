import { create } from 'zustand';

export interface QuizMetadata {
  title: string;
  description: string;
  timeLimitSeconds?: number | null;
}

export interface Question {
  type: 'mcq' | 'short' | 'code';
  prompt: string;
  options?: string[];
  correctAnswer: string | number;
}

interface QuizCreateStore {
  currentStep: 1 | 2;

  quizMetadata: QuizMetadata | null;

  questions: Question[];

  nextStep: (metadata: QuizMetadata) => void;
  prevStep: () => void;
  addQuestion: (question: Question) => void;
  removeQuestion: (index: number) => void;
  reset: () => void;
}

export const useQuizCreateStore = create<QuizCreateStore>((set) => ({
  currentStep: 1,
  quizMetadata: null,
  questions: [],

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
  reset: () =>
    set({
      currentStep: 1,
      quizMetadata: null,
      questions: [],
    }),
}));
