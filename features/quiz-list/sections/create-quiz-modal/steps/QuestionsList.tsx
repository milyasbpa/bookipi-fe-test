'use client';

import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/core/components/button';
import { useCreateWizardStore } from '../../../store/create-wizard.store';

export function QuestionsList() {
  const t = useTranslations('quiz-maker.builder');
  const { questions, removeQuestion } = useCreateWizardStore();

  if (questions.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">
        {t('questions')} ({questions.length})
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
            onClick={() => removeQuestion(index)}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}
