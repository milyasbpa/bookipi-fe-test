import { useCreateQuiz as useCreateQuizAPI } from '@/core/api/generated/quizzes/quizzes';

export function useCreateQuiz() {
  return useCreateQuizAPI();
}
