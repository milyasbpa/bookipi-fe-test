/**
 * Quiz Query & Mutation Keys Factory
 * 
 * Centralized keys for quiz-list feature
 * 
 * Benefits:
 * - Type-safe keys
 * - Single source of truth
 * - Easy to maintain and refactor
 * - Prevents typos
 * - Support hierarchical invalidation
 * - Better debugging in React Query DevTools
 * 
 * Usage:
 * ```ts
 * // Query keys
 * queryClient.invalidateQueries({ queryKey: quizListQueryKeys.all() });
 * queryClient.invalidateQueries({ queryKey: quizListQueryKeys.detail(123) });
 * 
 * // Mutation keys
 * useMutation({
 *   mutationKey: quizListMutationKeys.createQuiz(),
 *   mutationFn: ...
 * });
 * ```
 */

/**
 * Query Keys for fetching data
 */
export const quizListQueryKeys = {
  /**
   * Key for fetching all quizzes list
   * @returns ['/quizzes']
   */
  all: () => ['/quizzes'] as const,

  /**
   * Key for fetching a single quiz by ID
   * @param id - Quiz ID
   * @returns ['/quizzes/{id}']
   */
  detail: (id: number) => [`/quizzes/${id}`] as const,
} as const;

/**
 * Mutation Keys for data modifications
 */
export const quizListMutationKeys = {
  /**
   * Key for creating a new quiz
   * @returns ['quiz-list', 'createQuiz']
   */
  createQuiz: () => ['quiz-list', 'createQuiz'] as const,

  /**
   * Key for updating a quiz
   * @returns ['quiz-list', 'updateQuiz']
   */
  updateQuiz: () => ['quiz-list', 'updateQuiz'] as const,

  /**
   * Key for creating a question in a quiz
   * @param quizId - Parent quiz ID
   * @returns ['quiz-list', 'createQuestion', quizId]
   */
  createQuestion: (quizId: number) =>
    ['quiz-list', 'createQuestion', quizId] as const,

  /**
   * Key for updating a question
   * @param quizId - Parent quiz ID
   * @returns ['quiz-list', 'updateQuestion', quizId]
   */
  updateQuestion: (quizId: number) =>
    ['quiz-list', 'updateQuestion', quizId] as const,

  /**
   * Key for deleting a question
   * @param quizId - Parent quiz ID
   * @returns ['quiz-list', 'deleteQuestion', quizId]
   */
  deleteQuestion: (quizId: number) =>
    ['quiz-list', 'deleteQuestion', quizId] as const,
} as const;
