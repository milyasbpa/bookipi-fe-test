'use client';

import { useTranslations } from 'next-intl';

import { Dialog } from '../../components/dialog';
import { useBuilderStore } from '../../store/builder.store';
import { QuizFormBuilder } from '../quiz-form/QuizForm.builder';

export function CreateQuizModal() {
  const t = useTranslations('quiz-maker.builder');
  const isOpen = useBuilderStore((s) => s.isCreateModalOpen);
  const closeModal = useBuilderStore((s) => s.closeCreateModal);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeModal}
      title={t('create-quiz-modal-title')}
      description={t('create-quiz-modal-description')}
      size="lg"
    >
      <QuizFormBuilder />
    </Dialog>
  );
}
