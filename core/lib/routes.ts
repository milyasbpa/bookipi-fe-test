export const ROUTES = {
  HOME: '/',
  QUIZ_LIST: '/',
  QUIZ_DETAIL: (quizId: number) => `/quiz/${quizId}`,
  QUIZ_PLAYER: (quizId: number) => `/quiz-maker/player/${quizId}`,
  QUIZ_RESULTS: (attemptId: number) => `/quiz-maker/results/${attemptId}`,
} as const;
