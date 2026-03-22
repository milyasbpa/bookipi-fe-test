'use client';

import { Trash2 } from 'lucide-react';

import { Button } from '@/core/components';
import type { Question } from '@/core/api/generated/quizMakerAPI.schemas';

interface QuestionListProps {
  questions: Question[];
  onDelete: (questionId: number) => void;
  isDeleting?: boolean;
  loadingLabel: string;
  noQuestionsLabel: string;
  questionsLabel: string;
  typeLabel: string;
  typeNaLabel: string;
  answerLabel: string;
  deleteConfirmLabel: string;
}

export function QuestionListBuilder({
  questions,
  onDelete,
  isDeleting,
  loadingLabel,
  noQuestionsLabel,
  questionsLabel,
  typeLabel,
  typeNaLabel,
  answerLabel,
  deleteConfirmLabel,
}: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
        {noQuestionsLabel}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">
        {questionsLabel} ({questions.length})
      </h3>

      {questions.map((question: Question, index: number) => (
        <div key={question.id} className="rounded-lg border p-4">
          <div className="flex justify-between gap-4">
            <div className="flex-1">
              <p className="font-medium">
                {index + 1}. {question.prompt}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {typeLabel} {question.type?.toUpperCase() || typeNaLabel}
              </p>

              {question.type === 'mcq' && question.options && (
                <ul className="mt-2 space-y-1 text-sm">
                  {question.options.map((opt: string, i: number) => (
                    <li
                      key={i}
                      className={
                        i === question.correctAnswer
                          ? 'font-semibold text-green-600'
                          : 'text-muted-foreground'
                      }
                    >
                      {String.fromCharCode(65 + i)}. {opt}
                      {i === question.correctAnswer && ' ✓'}
                    </li>
                  ))}
                </ul>
              )}

              {question.type === 'short' && (
                <p className="mt-2 text-sm">
                  <span className="text-muted-foreground">{answerLabel}</span>{' '}
                  <span className="font-medium">{question.correctAnswer}</span>
                </p>
              )}
            </div>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => {
                if (question.id && confirm(deleteConfirmLabel)) {
                  onDelete(question.id);
                }
              }}
              disabled={isDeleting}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
