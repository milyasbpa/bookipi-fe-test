'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { MCQOptions } from '@/core/components';

interface QuestionFormProps {
  onAdd: (question: any) => void;
}

export function QuestionForm({ onAdd }: QuestionFormProps) {
  const t = useTranslations('quiz-maker.builder');
  const [questionType, setQuestionType] = useState<'mcq' | 'short'>('mcq');
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [correctIndex, setCorrectIndex] = useState(-1);
  const [shortAnswer, setShortAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      return;
    }

    const question: any = {
      type: questionType,
      prompt: prompt.trim(),
    };

    if (questionType === 'mcq') {
      if (options.filter((opt) => opt.trim()).length < 2) {
        return;
      }
      if (correctIndex === -1) {
        return;
      }
      question.options = options.filter((opt) => opt.trim());
      question.correctAnswer = correctIndex;
    } else {
      if (!shortAnswer.trim()) {
        return;
      }
      question.correctAnswer = shortAnswer.trim();
    }

    onAdd(question);

    // Reset form
    setPrompt('');
    setOptions(['', '']);
    setCorrectIndex(-1);
    setShortAnswer('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
      <h3 className="font-semibold">{t('add-question')}</h3>

      {/* Type select */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('question-type')}</label>
        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value as 'mcq' | 'short')}
          className="w-full rounded-xl border p-3"
        >
          <option value="mcq">{t('multiple-choice')}</option>
          <option value="short">{t('short-answer')}</option>
        </select>
      </div>

      {/* Prompt */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('question-prompt')}</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('enter-your-question')}
          className="w-full rounded-xl border p-3"
          rows={2}
          required
        />
      </div>

      {/* Options for MCQ */}
      {questionType === 'mcq' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('options')}</label>
          <MCQOptions
            options={options}
            onChange={setOptions}
            selectedCorrectIndex={correctIndex}
            onSelectCorrect={setCorrectIndex}
            addOptionButtonLabel={t('add-option-button')}
            optionPlaceholder={t('add-option-placeholder')}
            selectCorrectHint={t('select-correct-hint')}
          />
        </div>
      )}

      {/* Correct Answer for Short */}
      {questionType === 'short' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('correct-answer')}</label>
          <Input
            value={shortAnswer}
            onChange={(e) => setShortAnswer(e.target.value)}
            placeholder={t('correct-answer-text')}
            required
          />
        </div>
      )}

      <Button type="submit" variant="outline" className="w-full">
        + {t('add-question-button')}
      </Button>
    </form>
  );
}
