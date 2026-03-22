import { z } from 'zod';

/**
 * Quiz Form Schema
 * 
 * Shared schema for quiz metadata across features
 * Used in: quiz-list, quiz-create, quiz-detail
 */
export const quizSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  timeLimitSeconds: z
    .number()
    .int()
    .min(60, 'Minimum 60 seconds')
    .max(7200, 'Maximum 2 hours')
    .nullable()
    .optional(),
  isPublished: z.boolean().optional(),
});

export type QuizFormValues = z.infer<typeof quizSchema>;
