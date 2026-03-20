'use client';

import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';

import { Dialog } from '../../components/dialog';
import { useBuilderStore } from '../../store/builder.store';
import { QuestionFormBuilder } from '../question-form/QuestionForm.builder';

export function AddQuestionModal() {
  const t = useTranslations('quiz-maker.builder');
  const queryClient = useQueryClient();
  const isOpen = useBuilderStore((s) => s.isAddQuestionModalOpen);
  const closeModal = useBuilderStore((s) => s.closeAddQuestionModal);
  const selectedQuizId = useBuilderStore((s) => s.selectedQuizId);
  const selectedQuizTitle = useBuilderStore((s) => s.selectedQuizTitle);

  const handleClose = () => {
    closeModal();
    // Refresh quiz list when modal closes
    queryClient.invalidateQueries({ queryKey: ['/quizzes'] });
  };

  if (!selectedQuizId) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
      title={t('add-question-modal-title', { quizTitle: selectedQuizTitle || '' })}
      description={t('add-question-modal-description')}
      size="xl"
    >
      <QuestionFormBuilder quizId={selectedQuizId} />
    </Dialog>
  );
}
