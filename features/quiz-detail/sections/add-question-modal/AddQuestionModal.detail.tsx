'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Dialog } from '@/core/components';
import { AddQuestionForm } from '../../components/add-question-form';
import { useQuizDetailStore } from '../../store/quiz-detail.store';

/**
 * AddQuestionModal Section
 * Modal for adding a new question to the quiz
 */
export function AddQuestionModal() {
  const params = useParams();
  const t = useTranslations('quiz-maker.builder');
  const quizId = Number(params.id);

  const isOpen = useQuizDetailStore((s) => s.isAddQuestionModalOpen);
  const closeModal = useQuizDetailStore((s) => s.closeAddQuestionModal);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeModal}
      title={t('add-question-modal-title')}
      description={t('add-question-modal-description')}
      size="lg"
    >
      <AddQuestionForm quizId={quizId} />
    </Dialog>
  );
}
