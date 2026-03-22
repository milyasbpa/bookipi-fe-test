'use client';

import { Trash2 } from 'lucide-react';

import { Button } from '@/core/components/button';

interface Question {
  type: 'mcq' | 'short' | 'code';
  prompt: string;
  options?: string[];
  correctAnswer: string | number;
}

interface QuestionsListProps {
  questions: Question[];
  onRemove: (index: number) => void;
  titleLabel: string;
}

export function QuestionsList({ questions, onRemove, titleLabel }: QuestionsListProps) {
  if (questions.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">
        {titleLabel} ({questions.length})
      </h3>
      {questions.map((q, index) => (
        <div
          key={index}
          className="flex items-start gap-2 rounded-lg border p-3"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">#{index + 1}</span>
              <span className="text-xs uppercase text-muted-foreground">
                {q.type}
              </span>
            </div>
            <p className="mt-1 text-sm">{q.prompt}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}
