'use client';

import { useTranslations } from 'next-intl';

import { Dialog } from '../../components/dialog';
import { useBuilderStore } from '../../store/builder.store';
import { EditQuizForm } from './EditQuizForm';

export function EditQuiz() {
  const t = useTranslations('quiz-maker.builder');
  const isOpen = useBuilderStore((s) => s.isEditModalOpen);
  const closeModal = useBuilderStore((s) => s.closeEditModal);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeModal}
      title={t('edit-quiz-modal-title')}
      description={t('edit-quiz-modal-description')}
      size="lg"
    >
      <EditQuizForm />
    </Dialog>
  );
}
