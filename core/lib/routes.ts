export const ROUTES = {
  HOME: '/',
  QUIZ_BUILDER: '/quiz-maker/builder',
  QUIZ_PLAYER: (quizId: number) => `/quiz-maker/player/${quizId}`,
  QUIZ_RESULTS: (attemptId: number) => `/quiz-maker/results/${attemptId}`,
} as const;
