'use client';

import { useTranslations } from 'next-intl';

import { Dialog } from '../../components/dialog';
import { useCreateWizardStore } from '../../store/create-wizard.store';
import { QuizMetadataStep, AddQuestionsStep } from './steps';

export function CreateQuiz() {
  const t = useTranslations('quiz-maker.builder');
  const { isOpen, closeWizard, currentStep } = useCreateWizardStore();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeWizard}
      title={t('create-quiz-wizard-title')}
      description={t(`create-quiz-wizard-step-${currentStep}-description`)}
      size="lg"
    >
      <div className="space-y-4">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              currentStep === 1
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            1
          </div>
          <div className="h-px flex-1 bg-muted" />
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              currentStep === 2
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            2
          </div>
        </div>

        {/* Step content */}
        {currentStep === 1 && <QuizMetadataStep />}
        {currentStep === 2 && <AddQuestionsStep />}
      </div>
    </Dialog>
  );
}

