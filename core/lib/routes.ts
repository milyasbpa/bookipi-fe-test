export const ROUTES = {
  HOME: '/',
  QUIZ_LIST: '/',
  QUIZ_CREATE: '/quiz-maker/create',
  QUIZ_DETAIL: (quizId: number) => `/quiz/${quizId}`,
  QUIZ_PLAYER: (quizId: number) => `/quiz-maker/player/${quizId}`,
} as const;
