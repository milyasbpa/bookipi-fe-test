import { z } from 'zod';

/**
 * Quiz Form Schema
 * 
 * Shared schema for quiz metadata across features
 * Used in: quiz-list, quiz-create, quiz-detail
 */
export const quizSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  timeLimitSeconds: z
    .number()
    .int()
    .min(60, 'Minimum 60 seconds')
    .max(7200, 'Maximum 2 hours')
    .nullable()
    .optional(),
});

export type QuizFormValues = z.infer<typeof quizSchema>;
