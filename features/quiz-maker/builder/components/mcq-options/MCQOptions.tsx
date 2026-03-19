import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/core/components';
import { Input } from '@/core/components';

interface MCQOptionsProps {
  options: string[];
  onChange: (options: string[]) => void;
  selectedCorrectIndex?: number;
  onSelectCorrect: (index: number) => void;
  disabled?: boolean;
}

export function MCQOptions({
  options,
  onChange,
  selectedCorrectIndex,
  onSelectCorrect,
  disabled,
}: MCQOptionsProps) {
  const [newOption, setNewOption] = useState('');

  const addOption = () => {
    if (newOption.trim() && options.length < 6) {
      onChange([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
    if (selectedCorrectIndex === index) {
      onSelectCorrect(-1);
    }
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="radio"
            checked={selectedCorrectIndex === index}
            onChange={() => onSelectCorrect(index)}
            disabled={disabled}
            className="shrink-0 size-4 cursor-pointer disabled:cursor-not-allowed"
          />
          <Input value={option} disabled className="flex-1" readOnly />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => removeOption(index)}
            disabled={disabled || options.length <= 2}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}

      <div className="flex gap-2">
        <Input
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Add option..."
          disabled={disabled || options.length >= 6}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addOption();
            }
          }}
        />
        <Button
          type="button"
          onClick={addOption}
          disabled={disabled || !newOption.trim() || options.length >= 6}
        >
          <Plus className="size-4" />
          Add
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Select the radio button to mark the correct answer
      </p>
    </div>
  );
}
