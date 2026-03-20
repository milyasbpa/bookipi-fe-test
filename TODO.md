# Quiz Maker - Refactor & Completion TODO

> **Status**: Implementation gaps identified after comparing with take-home requirements
> **Created**: March 20, 2026
> **Priority**: Fix critical gaps before submission

---

## Executive Summary

### Current State
- ✅ **Player Feature**: 100% complete (load quiz, answer, submit, results)
- ⚠️ **Builder Feature**: 60% complete (create/edit quiz works, question CRUD UI missing)
- ❌ **Anti-Cheat (Bonus)**: 0% complete (hooks exist, no implementation)

### Updated Approach (Combined Create + Edit)
**Why the change:**
- Take-home spec says: "create quiz → add questions → save" (unified flow)
- Current approach: create quiz → navigate → add questions (disjointed)
- **New approach**: 2-step wizard (create) + detail page (edit)

**Benefits:**
- ✅ Better onboarding: Wizard ensures initial questions during creation
- ✅ Better editing: Full page for managing 50+ questions with Tanstack Table
- ✅ Better alignment with take-home requirements
- ✅ Professional-grade UX (matches Github, Notion, Linear patterns)

### Critical Gaps to Fix
1. **Create flow**: Single-step → 2-step wizard (metadata + questions)
2. **List view**: Cards → Tanstack Table (professional, sortable)
3. **Edit flow**: Add detail page route (`/quiz/:id`) for scalable editing with full CRUD
4. **Anti-cheat**: Implement tracking + display (bonus feature)

### Total Remaining Work: ~4.5 hours
- Preparation: 30 min (Step 0 - Restructure folders)
- Critical: 2 hours (Task 1.1 - includes create + edit + delete)
- Bonus: 1.5 hours (Task 2.1-2.3)
- Polish: 0.5 hours (Task 3.1-3.2)

> **Note:** Edit and Delete question functionality consolidated into Task 1.1 Part C (Quiz Detail Page), saving 45 minutes.

---

## Step 0: Restructure Feature Folders (PREPARATION) 🔧

**Estimated Time: 30 minutes** | **Priority**: Do this BEFORE Task 1.1

**Why This Step:**
- Clean folder structure BEFORE implementing new features
- Avoid double work (create in wrong place → move later)
- `quiz-maker/` prefix is redundant (app is already a quiz maker)
- Align with "per-page" convention (quiz-list, quiz-detail, quiz-player, quiz-results)

**Current Structure (Redundant):**
```
features/
└── quiz-maker/
    ├── builder/      → List page (/)
    ├── player/       → Player page (/player/:id)
    └── results/      → Results page (/results/:id)
```

**Target Structure (Clean):**
```
features/
├── quiz-list/        → Root / (list + create wizard)
├── quiz-detail/      → /quiz/:id (NEW - will create in Task 1.1)
├── quiz-player/      → /player/:id
└── quiz-results/     → /results/:id
```

**Steps:**

**0.1: Rename Folders**
- [ ] Rename `features/quiz-maker/builder/` → `features/quiz-list/`
- [ ] Rename `features/quiz-maker/player/` → `features/quiz-player/`
- [ ] Rename `features/quiz-maker/results/` → `features/quiz-results/`
- [ ] Delete empty `features/quiz-maker/` folder

**0.2: Update Import Paths**
- [ ] Find & Replace in all files:
  - `@/features/quiz-maker/builder` → `@/features/quiz-list`
  - `@/features/quiz-maker/player` → `@/features/quiz-player`
  - `@/features/quiz-maker/results` → `@/features/quiz-results`
  - `features/quiz-maker/builder` → `features/quiz-list`
  - `features/quiz-maker/player` → `features/quiz-player`
  - `features/quiz-maker/results` → `features/quiz-results`

**0.3: Update Route Imports**
- [ ] Update `app/(locale)/page.tsx`:
  - `import { BuilderContainer } from '@/features/quiz-maker/builder'`
  - `import { QuizListContainer } from '@/features/quiz-list'`
- [ ] Update `app/(locale)/quiz-maker/player/[id]/page.tsx`:
  - `import { PlayerContainer } from '@/features/quiz-maker/player'`
  - `import { PlayerContainer } from '@/features/quiz-player'`
- [ ] Update `app/(locale)/quiz-maker/results/[attemptId]/page.tsx`:
  - `import { ResultsContainer } from '@/features/quiz-maker/results'`
  - `import { ResultsContainer } from '@/features/quiz-results'`

**0.4: Rename Container Components (Optional but Recommended)**
- [ ] Rename `BuilderContainer` → `QuizListContainer`
- [ ] Update exports in `features/quiz-list/index.ts`

**0.5: Update i18n Keys (If Needed)**
- [ ] Check `core/i18n/json/en/quiz-maker.json`
- [ ] Rename if using component names in translations

**0.6: Verify Build**
- [ ] Run `npm run build` or `pnpm build`
- [ ] Fix any broken imports
- [ ] Verify TypeScript errors cleared

**0.7: Git Commit**
- [ ] Stage changes: `git add .`
- [ ] Commit: `git commit -m "refactor: restructure features folder (quiz-list, quiz-player, quiz-results)"`
- [ ] Push: `git push origin main`

**Acceptance Criteria:**
- ✅ No `features/quiz-maker/` folder exists
- ✅ All imports updated correctly
- ✅ Build passes without errors
- ✅ App runs without console errors
- ✅ Ready for Task 1.1 implementation

**Benefits After This Step:**
1. Task 1.1 can create `quiz-detail/` directly in correct location
2. No confusion about "builder" vs "list"
3. Clear mapping: folder name = page purpose
4. Scalable for future pages

---

## Priority 1: Critical Fixes (MUST DO) 🔴

**Estimated Time: 2 hours**

These are **core requirements** from take-home test that need proper implementation.

### Task 1.1: Implement Combined Create + Edit Flow
**Time: 120 minutes** | **Blocking**: Core builder functionality

**Why Combined Approach:**
- ✅ **CREATE**: 2-step wizard modal (matches take-home "create quiz → add questions → save" flow)
- ✅ **EDIT**: Detail page with full CRUD (scalable for 50+ questions)
- ✅ Best onboarding UX (unified flow)
- ✅ Best editing UX (full page space)
- ✅ Meets take-home requirements perfectly

**Problem with Current Implementation:**
- ❌ Create quiz = empty quiz (no questions initially)
- ❌ Must navigate separately to add questions
- ❌ Disjointed UX ("create" ≠ "add questions")
- ❌ Not aligned with take-home spec: "create quiz → add questions → save"

**New Architecture:**

```
CREATE FLOW (First Time - 2-Step Modal):
[Create Quiz Button] → Opens Modal (Wizard)
├─ Step 1: Quiz Metadata
│   ├─ Title, Description, Time Limit
│   └─ [Next: Add Questions →]
│
├─ Step 2: Add Questions
│   ├─ Question Form (MCQ/Short Answer)
│   ├─ Added Questions List (local state)
│   ├─ [+ Add Another Question]
│   └─ [← Back | Submit Quiz]
│
└─ On Submit:
    1. POST /quizzes (get quizId)
    2. POST /quizzes/:id/questions (for each question)
    3. Show success: Quiz ID + Question count
    4. Redirect to /quiz/:id (optional)

EDIT FLOW (After Creation - Detail Page):
/ (Root - Quiz List with Table)
└─ Click "Manage" → Navigate to /quiz/:id

/quiz/:id (Detail Page)
├─ Quiz Header (title, description, back button)
├─ Actions: "Add Question", "Edit Quiz", "Play"
├─ Questions Table (Tanstack Table)
│   ├─ Sortable columns
│   ├─ Edit button → EditQuestionModal
│   └─ Delete button → Confirm dialog
└─ Modals:
    ├─ AddQuestionModal (add new question)
    └─ EditQuestionModal (edit existing)
```

**Steps:**

**Part A: 2-Step Create Quiz Modal (Wizard Pattern)**

**A.1: Install Dependencies**
- [ ] Install Tanstack React Table (for list + detail page):
  ```bash
  npm install @tanstack/react-table
  # or
  pnpm add @tanstack/react-table
  ```

**A.2: Create Wizard Store**
- [ ] Create `features/quiz-maker/builder/store/create-wizard.store.ts`:
  ```typescript
  import { create } from 'zustand';
  
  interface QuizMetadata {
    title: string;
    description: string;
    timeLimitSeconds: number | null;
  }
  
  interface Question {
    type: 'mcq' | 'short' | 'code';
    prompt: string;
    options?: string[];
    correctAnswer: string | number;
  }
  
  interface CreateWizardStore {
    // Modal state
    isOpen: boolean;
    currentStep: 1 | 2;
    
    // Step 1 data
    quizMetadata: QuizMetadata | null;
    
    // Step 2 data
    questions: Question[];
    
    // Actions
    openWizard: () => void;
    closeWizard: () => void;
    nextStep: (metadata: QuizMetadata) => void;
    prevStep: () => void;
    addQuestion: (question: Question) => void;
    removeQuestion: (index: number) => void;
    resetWizard: () => void;
  }
  
  export const useCreateWizardStore = create<CreateWizardStore>((set) => ({
    isOpen: false,
    currentStep: 1,
    quizMetadata: null,
    questions: [],
    
    openWizard: () => set({ isOpen: true, currentStep: 1 }),
    closeWizard: () => set({ isOpen: false }),
    nextStep: (metadata) => set({ 
      currentStep: 2, 
      quizMetadata: metadata 
    }),
    prevStep: () => set({ currentStep: 1 }),
    addQuestion: (question) => set((state) => ({ 
      questions: [...state.questions, question] 
    })),
    removeQuestion: (index) => set((state) => ({ 
      questions: state.questions.filter((_, i) => i !== index) 
    })),
    resetWizard: () => set({ 
      currentStep: 1, 
      quizMetadata: null, 
      questions: [] 
    }),
  }));
  ```

**A.3: Refactor CreateQuizModal to 2-Step Wizard**
- [ ] Update `CreateQuizModal.builder.tsx`:
  ```tsx
  'use client';
  
  import { useTranslations } from 'next-intl';
  import { Dialog } from '../../components/dialog';
  import { useCreateWizardStore } from '../../store/create-wizard.store';
  import { QuizMetadataStep } from './steps/QuizMetadataStep';
  import { AddQuestionsStep } from './steps/AddQuestionsStep';
  
  export function CreateQuizModal() {
    const t = useTranslations('quiz-maker.builder');
    const { isOpen, closeWizard, currentStep } = useCreateWizardStore();
    
    return (
      <Dialog
        open={isOpen}
        onOpenChange={closeWizard}
        title={currentStep === 1 ? t('create-quiz-step-1-title') : t('create-quiz-step-2-title')}
        description={currentStep === 1 ? t('create-quiz-step-1-desc') : t('create-quiz-step-2-desc')}
        size="xl"
      >
        {/* Step Indicator */}
        <div className="mb-6 flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
            currentStep === 1 ? 'bg-primary text-white' : 'bg-green-500 text-white'
          }`}>
            1
          </div>
          <div className="h-px flex-1 bg-border" />
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
            currentStep === 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
          }`}>
            2
          </div>
        </div>
        
        {/* Step Content */}
        {currentStep === 1 && <QuizMetadataStep />}
        {currentStep === 2 && <AddQuestionsStep />}
      </Dialog>
    );
  }
  ```

**A.4: Create Step 1 - Quiz Metadata**
- [ ] Create `CreateQuizModal.builder.tsx/steps/QuizMetadataStep.tsx`:
  ```tsx
  'use client';
  
  import { zodResolver } from '@hookform/resolvers/zod';
  import { useTranslations } from 'next-intl';
  import { useForm } from 'react-hook-form';
  import { Button, FormField, Input } from '@/core/components';
  import { useCreateWizardStore } from '../../../store/create-wizard.store';
  import { quizSchema, type QuizFormValues } from '../../../sections/quiz-form/quiz-form.builder.schema';
  
  export function QuizMetadataStep() {
    const t = useTranslations('quiz-maker.builder');
    const { quizMetadata, nextStep } = useCreateWizardStore();
    
    const { control, handleSubmit } = useForm<QuizFormValues>({
      resolver: zodResolver(quizSchema),
      defaultValues: quizMetadata || {
        title: '',
        description: '',
        timeLimitSeconds: 300,
      },
    });
    
    const onNext = (values: QuizFormValues) => {
      nextStep(values);
    };
    
    return (
      <form onSubmit={handleSubmit(onNext)} className="space-y-4">
        <FormField
          name="title"
          control={control}
          label={t('title-label')}
          render={({ field, fieldState }) => (
            <Input {...field} placeholder={t('title-placeholder')} />
          )}
        />
        
        <FormField
          name="description"
          control={control}
          label={t('description-label')}
          render={({ field, fieldState }) => (
            <textarea {...field} placeholder={t('description-placeholder')} 
              className="w-full rounded-xl border p-4" rows={3} />
          )}
        />
        
        <FormField
          name="timeLimitSeconds"
          control={control}
          label={t('time-limit-label')}
          render={({ field, fieldState }) => (
            <Input {...field} type="number" min={60} max={7200} 
              onChange={(e) => field.onChange(e.target.valueAsNumber || null)} />
          )}
        />
        
        <Button type="submit" variant="primary" size="lg" className="w-full">
          {t('next-add-questions')} →
        </Button>
      </form>
    );
  }
  ```

**A.5: Create Step 2 - Add Questions**
- [ ] Create `CreateQuizModal.builder.tsx/steps/AddQuestionsStep.tsx`:
  ```tsx
  'use client';
  
  import { useState } from 'react';
  import { useTranslations } from 'next-intl';
  import { useRouter } from 'next/navigation';
  import { toast } from 'sonner';
  import { Button } from '@/core/components';
  import { useCreateWizardStore } from '../../../store/create-wizard.store';
  import { useCreateQuiz } from '../../../react-query/use-create-quiz';
  import { useCreateQuestion } from '../../../react-query/use-create-question';
  import { QuestionForm } from './QuestionForm'; // New reusable form
  import { QuestionsList } from './QuestionsList'; // New list component
  import { ROUTES } from '@/core/lib/routes';
  
  export function AddQuestionsStep() {
    const t = useTranslations('quiz-maker.builder');
    const router = useRouter();
    const { quizMetadata, questions, prevStep, addQuestion, resetWizard, closeWizard } = useCreateWizardStore();
    const createQuiz = useCreateQuiz();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleAddQuestion = (question: any) => {
      addQuestion(question);
      toast.success(t('question-added'));
    };
    
    const handleSubmit = async () => {
      if (questions.length === 0) {
        toast.error(t('add-at-least-one-question'));
        return;
      }
      
      setIsSubmitting(true);
      
      try {
        // Step 1: Create quiz
        const quiz = await createQuiz.mutateAsync({ data: quizMetadata! });
        const quizId = quiz.id!;
        
        // Step 2: Add all questions
        await Promise.all(
          questions.map((q) => 
            useCreateQuestion(quizId).mutateAsync({ id: quizId, data: q })
          )
        );
        
        // Success!
        toast.success(t('quiz-created-successfully', { 
          id: quizId, 
          count: questions.length 
        }));
        
        resetWizard();
        closeWizard();
        
        // Optional: Navigate to detail page
        router.push(ROUTES.QUIZ_DETAIL(quizId));
        
      } catch (error) {
        toast.error(t('failed-to-create-quiz'));
      } finally {
        setIsSubmitting(false);
      }
    };
    
    return (
      <div className="space-y-6">
        {/* Question Form */}
        <QuestionForm onAdd={handleAddQuestion} />
        
        {/* Questions List */}
        <QuestionsList />
        
        {/* Actions */}
        <div className="flex gap-2 border-t pt-4">
          <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
            ← {t('back')}
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            disabled={isSubmitting || questions.length === 0}
            className="flex-1"
          >
            {isSubmitting ? t('creating-quiz') : t('submit-quiz', { count: questions.length })}
          </Button>
        </div>
        
        {questions.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            {t('add-at-least-one-question-hint')}
          </p>
        )}
      </div>
    );
  }
  ```

**A.6: Create Reusable Question Form Component**
- [ ] Create `CreateQuizModal.builder.tsx/steps/QuestionForm.tsx`:
  ```tsx
  'use client';
  
  import { useForm } from 'react-hook-form';
  import { Button, FormField, Input } from '@/core/components';
  import { MCQOptions } from '../../../components/mcq-options/MCQOptions';
  
  interface QuestionFormProps {
    onAdd: (question: any) => void;
  }
  
  export function QuestionForm({ onAdd }: QuestionFormProps) {
    const { control, handleSubmit, watch, reset } = useForm({
      defaultValues: {
        type: 'mcq',
        prompt: '',
        options: ['', ''],
        correctAnswer: '',
      },
    });
    
    const questionType = watch('type');
    
    const onSubmit = (values: any) => {
      onAdd(values);
      reset(); // Clear form after adding
    };
    
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border p-4">
        <h3 className="font-semibold">Add Question</h3>
        
        {/* Type select */}
        <FormField name="type" control={control} label="Question Type" 
          render={({ field }) => (
            <select {...field} className="w-full rounded-xl border p-3">
              <option value="mcq">Multiple Choice</option>
              <option value="short">Short Answer</option>
            </select>
          )}
        />
        
        {/* Prompt */}
        <FormField name="prompt" control={control} label="Question Prompt"
          render={({ field }) => (
            <textarea {...field} placeholder="Enter your question..." 
              className="w-full rounded-xl border p-3" rows={2} />
          )}
        />
        
        {/* Options for MCQ */}
        {questionType === 'mcq' && <MCQOptions control={control} />}
        
        {/* Correct Answer */}
        <FormField name="correctAnswer" control={control} label="Correct Answer"
          render={({ field }) => (
            questionType === 'mcq' ? (
              <Input {...field} type="number" placeholder="Option index (0, 1, 2...)" />
            ) : (
              <Input {...field} placeholder="Correct answer text" />
            )
          )}
        />
        
        <Button type="submit" variant="outline" className="w-full">
          + Add Question
        </Button>
      </form>
    );
  }
  ```

**A.7: Create Questions List Component**
- [ ] Create `CreateQuizModal.builder.tsx/steps/QuestionsList.tsx`:
  ```tsx
  'use client';
  
  import { Trash2 } from 'lucide-react';
  import { Button } from '@/core/components';
  import { useCreateWizardStore } from '../../../store/create-wizard.store';
  
  export function QuestionsList() {
    const { questions, removeQuestion } = useCreateWizardStore();
    
    if (questions.length === 0) return null;
    
    return (
      <div className="space-y-2">
        <h3 className="font-semibold">Questions ({questions.length})</h3>
        {questions.map((q, index) => (
          <div key={index} className="flex items-start gap-2 rounded-lg border p-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">#{index + 1}</span>
                <span className="text-xs uppercase text-muted-foreground">{q.type}</span>
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
  ```

**A.8: Update Builder Store**
- [ ] Update `builder.store.ts`:
  - [ ] Change `openCreateModal` to use new wizard:
    ```typescript
    openCreateModal: () => useCreateWizardStore.getState().openWizard(),
    ```

**Part B: Quiz List Page (Root with Tanstack Table)**

**B.1: Update Routes**
- [ ] Update `core/lib/routes.ts`:
  - [ ] Change `QUIZ_BUILDER: '/quiz-maker/builder'` → `QUIZ_BUILDER: '/'`
  - [ ] Add `QUIZ_DETAIL: (id: number) => `/quiz/${id}``
  - [ ] Change `QUIZ_PLAYER: (id: number) => `/player/${id}``

**B.2: Update Root Page**
- [ ] Update `app/(locale)/page.tsx`:
  - [ ] Remove redirect to `/quiz-maker/builder`
  - [ ] Render `BuilderContainer` directly

**B.3: Refactor QuizListBuilder to Tanstack Table**
- [ ] Update `QuizListBuilder.tsx` - Replace cards with table (same as before):
  - [ ] Import `useReactTable, getCoreRowModel, ColumnDef, flexRender`
  - [ ] Define columns: Title+Description, Questions count, Time limit, Actions
  - [ ] Actions: Edit (modal), Manage (navigate /quiz/:id), Play (navigate /player/:id)
  - [ ] Keep "Create Quiz" button (opens 2-step wizard)
  - [ ] Keep empty state, loading state

**Part B: Quiz List Page (Root with Tanstack Table)**

**B.1: Update Routes**
- [ ] Update `core/lib/routes.ts`:
  - [ ] Change `QUIZ_BUILDER: '/quiz-maker/builder'` → `QUIZ_BUILDER: '/'`
  - [ ] Add `QUIZ_DETAIL: (id: number) => `/quiz/${id}``
  - [ ] Change `QUIZ_PLAYER: (id: number) => `/player/${id}``

**B.2: Update Root Page**
- [ ] Update `app/(locale)/page.tsx`:
  - [ ] Remove redirect to `/quiz-maker/builder`
  - [ ] Render `BuilderContainer` directly

**B.3: Refactor QuizListBuilder to Tanstack Table**
- [ ] Update `QuizListBuilder.tsx` - Replace cards with table (same as before):
  - [ ] Import `useReactTable, getCoreRowModel, ColumnDef, flexRender`
  - [ ] Define columns: Title+Description, Questions count, Time limit, Actions
  - [ ] Actions: Edit (modal), Manage (navigate /quiz/:id), Play (navigate /player/:id)
  - [ ] Keep "Create Quiz" button (opens 2-step wizard)
  - [ ] Keep empty state, loading state

**Part C: Quiz Detail Page (For Editing After Creation)**
**Part C: Quiz Detail Page (For Editing After Creation)**
**C.1: Create Route**
- [ ] Create route file:
  - [ ] `app/(locale)/quiz/[id]/page.tsx`
  ```tsx
  import { QuizDetailContainer } from '@/features/quiz-maker/quiz-detail';
  
  export default function QuizDetailPage() {
    return <QuizDetailContainer />;
  }
  ```
**C.2: Create Feature Folder**
- [ ] Create folder structure:
  ```
  features/quiz-maker/quiz-detail/
  ├── container/
  │   └── QuizDetail.container.tsx
  ├── sections/
  │   ├── quiz-header/
  │   │   └── QuizHeader.detail.tsx
  │   ├── question-actions/
  │   │   └── QuestionActions.detail.tsx
  │   └── question-table/
  │       └── QuestionTable.detail.tsx
  ├── store/
  │   └── quiz-detail.store.ts
  └── index.ts
  ```

**C.3: Create Container**
- [ ] Create `QuizDetail.container.tsx`:
  ```tsx
  'use client';
  
  import { QuizHeaderDetail } from '../sections/quiz-header';
  import { QuestionActionsDetail } from '../sections/question-actions';
  import { QuestionTableDetail } from '../sections/question-table';
  import { AddQuestionModal } from '../sections/add-question-modal';
  import { EditQuestionModal } from '../sections/edit-question-modal';
  
  export function QuizDetailContainer() {
    return (
      <div className="container mx-auto max-w-6xl space-y-6 p-6">
        <QuizHeaderDetail />
        <QuestionActionsDetail />
        <QuestionTableDetail />
        
        {/* Modals */}
        <AddQuestionModal />
        <EditQuestionModal />
      </div>
    );
  }
  ```
**C.4: Create Sections (same as before)**
- [ ] Create `QuizHeader.detail.tsx` (show title, description, back button, actions)
- [ ] Create `QuestionActions.detail.tsx` (Add Question button)
- [ ] Create `QuestionTable.detail.tsx` (list questions with Edit/Delete)
- [ ] Create `quiz-detail.store.ts` (modal state management)

**C.5: Create Modals for Detail Page**
- [ ] Create `AddQuestionModal.tsx` (read quizId from params)
- [ ] Create `EditQuestionModal.tsx` (pre-fill form, call update hook)tead of store
  - [ ] Read `isOpen` from `useQuizDetailStore`
  - [ ] Keep form-only (no list)

- [ ] Create `EditQuestionModal`:
  - [ ] Similar to AddQuestionModal
  - [ ] Pre-fill form with `editingQuestionData`
  - [ ] Call `useUpdateQuestion` on submit

**Part D: Add i18n Keys**
- [ ] Add to `core/i18n/json/en/quiz-maker.json`:
  ```json
  {
    "builder": {
      "manage-questions": "Manage Questions",
      "back-to-list": "Back to Quiz List",
      "quiz-not-found": "Quiz not found",
      "loading-quiz": "Loading quiz...",
      "questions-list": "Questions",
      "no-time-limit": "No time limit",
      "edit-quiz": "Edit Quiz"
    }
  }
  ```

**Acceptance Criteria:**
- ✅ Root `/` shows quiz list (not redirect)
- ✅ Click quiz card → Navigate to `/quiz/:id`
- ✅ Quiz detail page shows: header, questions table, actions
- ✅ Click "Add Question" → Modal opens (form only, clean)
- ✅ Click Edit on question → Modal opens with pre-filled data
- ✅ Click Delete → Confirm → Question removed
- ✅ Back button → Return to quiz list
- ✅ Full page space for questions (scalable)
- ✅ Shareable URL: `/quiz/5` works directly

> **Note:** Edit and Delete question functionality (formerly Task 1.2 & 1.3) are now part of Task 1.1 Part C implementation. This includes:
> - EditQuestionModal with pre-fill form
> - Delete button in QuestionTable with confirmation
> - `use-delete-question.ts` hook fix (invalidateQueries + toast)

---

## Priority 2: Bonus Features (SHOULD DO) 🟡

**Estimated Time: 1.5 hours**

These are **bonus features** that will impress reviewers but not strictly required.

### Task 2.1: Implement Focus/Blur Tracking
**Time: 30 minutes** | **Feature**: Anti-cheat window focus detection

**Requirement from take-home:**
> Log focus events: tab/window blur and focus with timestamps

**Steps:**
- [ ] Create `features/quiz-maker/player/hooks/useAntiCheat.ts`:
  ```typescript
  export function useAntiCheat(attemptId: number | null) {
    const { mutate: recordEvent } = useRecordEvent(attemptId || 0);
    
    useEffect(() => {
      if (!attemptId) return;
      
      const handleBlur = () => {
        recordEvent({ data: { event: 'focus_lost' } });
      };
      
      const handleFocus = () => {
        recordEvent({ data: { event: 'focus_regained' } });
      };
      
      window.addEventListener('blur', handleBlur);
      window.addEventListener('focus', handleFocus);
      
      return () => {
        window.removeEventListener('blur', handleBlur);
        window.removeEventListener('focus', handleFocus);
      };
    }, [attemptId, recordEvent]);
  }
  ```

- [ ] Update `Player.container.tsx`:
  - [ ] Import and call `useAntiCheat(attemptId)`
  - [ ] Hook will run throughout quiz session

**Acceptance Criteria:**
- ✅ Switch tabs during quiz → `focus_lost` logged to backend
- ✅ Return to tab → `focus_regained` logged
- ✅ Events saved to `attempt_events` table

---

### Task 2.2: Implement Paste Detection
**Time: 30 minutes** | **Feature**: Anti-cheat paste tracking

**Requirement from take-home:**
> Paste events: paste actions inside answer inputs with timestamps

**Steps:**
- [ ] Update `useAntiCheat.ts` hook:
  ```typescript
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Only track if target is input/textarea
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement) {
        recordEvent({ 
          data: { 
            event: 'paste_detected',
          } 
        });
      }
    };
    
    document.addEventListener('paste', handlePaste);
    
    retcreate-quiz-step-1-title": "Create Quiz - Step 1",
      "create-quiz-step-1-desc": "Enter quiz metadata",
      "create-quiz-step-2-title": "Create Quiz - Step 2",
      "create-quiz-step-2-desc": "Add questions to your quiz",
      "next-add-questions": "Next: Add Questions",
      "back": "Back",
      "submit-quiz": "Submit Quiz ({count} questions)",
      "creating-quiz": "Creating quiz...",
      "quiz-created-successfully": "Quiz created! ID: {id}, Questions: {count}",
      "add-at-least-one-question": "Please add at least one question",
      "add-at-least-one-question-hint": "Add at least one question before submitting",
      "question-added": "Question added",
      "manage-questions": "Manage Questions",
      "back-to-list": "Back to Quiz List",
      "quiz-not-found": "Quiz not found",
      "loading-quiz": "Loading quiz...",
      "loading-questions": "Loading questions...",
      "questions-list": "Questions",
      "no-questions": "No questions yet. Click 'Add Question' to start.",
      "no-time-limit": "No time limit",
      "edit-quiz": "Edit Quiz",
      "answer-label": "Answer:",
      "delete-confirm": "Are you sure you want to delete this question?"
    }
  }
  ```

**Acceptance Criteria:**
- ✅ Click "Create Quiz" → 2-step wizard opens
- ✅ Step 1: Fill metadata → Click "Next" → Step 2 loads
- ✅ Step 2: Add questions (1, 2, 3...) → See list below form
- ✅ Step 2: Can go back to edit metadata
- ✅ Step 2: Can remove questions before submit
- ✅ Submit → Quiz + questions created → Success message with Quiz ID
- ✅ Root `/` shows quiz table with all quizzes
- ✅ Click "Manage" → Navigate to `/quiz/:id`
- ✅ Quiz detail page shows header, questions, actions
- ✅ Click "Add Question" → Modal opens (single question form)
- ✅ Click Edit → Modal opens with pre-filled data
- ✅ Click Delete → Confirm → Question removed
- ✅ Click Play → Navigate to `/player/:id`
- ✅ Back button → Return to quiz list
- ✅ Full page space for managing 50+ questions

---

## Priority 2: Bonus Features (SHOULD DO) 🟡

**Estimated Time: 30 minutes**

### Task 3.1: Add Explicit Quiz ID Display
**Time: 15 minutes** | **Feature**: Show quiz ID after creation

**Problem:**
- Quiz ID only visible in URL after creation
- Original planning (TODO.md) had "QuizSummary" component
- Take-home test mentions: "show generated quizId"

**Steps:**
- [ ] Create `QuizSummary.builder.tsx` component:
  ```typescript
  interface QuizSummaryProps {
    quizId: number;
    title: string;
    questionCount: number;
  }
  
  export function QuizSummary({ quizId, title, questionCount }) {
    return (
      <div className="border-2 border-green-500 bg-green-50 p-4 rounded">
        <h3>✓ Quiz Created Successfully!</h3>
        <p><strong>Quiz ID:</strong> {quizId}</p>
        <p><strong>Title:</strong> {title}</p>
        <p><strong>Questions:</strong> {questionCount}</p>
      </div>
    );
  }
  ```

- [ ] Update `CreateQuizModal.builder.tsx`:
  - [ ] After quiz created, show `QuizSummary` component
  - [ ] OR: Add to modal footer
  - [ ] OR: Toast notification with quiz ID

**Acceptance Criteria:**
- ✅ After creating quiz, quiz ID prominently displayed
- ✅ Easy to copy/note down

---

### Task 3.2: Add Share Link Component
**Time: 15 minutes** | **Feature**: Easy sharing of quiz

**Steps:**
- [ ] Add to `QuizSummary` or quiz card:
  ```typescript
  const playerUrl = `${window.location.origin}/en/quiz-maker/player/${quizId}`;
  
  <div>
    <label>Share this link:</label>
    <div className="flex gap-2">
      <input value={playerUrl} readOnly />
      <button onClick={() => navigator.clipboard.writeText(playerUrl)}>
        Copy Link
      </button>
    </div>
  </div>
  ```

- [ ] Add copy success toast

**Acceptance Criteria:**
- ✅ Share link displayed for each quiz
- ✅ One-click copy to clipboard
- ✅ Toast confirms copy success

---

## Testing Checklist

After completing all tasks, verify:

### Builder Feature
- [ ] Create quiz → quiz appears in list
- [ ] Click "Add Questions" → modal opens
- [ ] Add MCQ question → appears in list below form
- [ ] Add Short Answer question → appears in list
- [ ] Click Edit on question → form pre-fills
- [ ] Modify and update → question changes in list
- [ ] Click Delete → confirm → question removed
- [ ] Close modal → question count in card updates
- [ ] Click "Start Quiz" → navigates to player

### Player Feature  
- [ ] Load quiz by ID → questions display
- [ ] Answer MCQ → selection saved
- [ ] Answer Short Answer → text saved
- [ ] Navigate previous/next → answers persist
- [ ] Switch tabs → focus event logged (if anti-cheat enabled)
- [ ] Paste answer → paste event logged (if anti-cheat enabled)
- [ ] Submit quiz → redirects to results

### Results Feature
- [ ] Score displays correctly
- [ ] Per-question breakdown shows correct/incorrect
- [ ] Anti-cheat summary shows (if implemented)
- [ ] Can navigate back to builder

---

## Implementation Order

**Step 0 (Preparation - 30 min):**
0. Restructure feature folders (quiz-list, quiz-player, quiz-results)
   - Move folders
   - Update imports
   - Test build
   - Git commit
→ **Clean structure ready**

**Day 1 (Core Fixes - 2 hours):**
1. Task 1.1: Combined Create + Edit Flow (120 min)
   - Part A: 2-step wizard modal (60 min)
   - Part B: Quiz list table (30 min)
   - Part C: Quiz detail page (30 min)
     - Includes: Edit modal, Delete button + hook fix
→ **Builder 100% complete**

**Day 2 (Bonus - 1.5 hours):**
2. Task 2.1: Focus tracking (30 min)
3. Task 2.2: Paste detection (30 min)
4. Task 2.3: Anti-cheat display (30 min)
→ **Anti-cheat 100% complete**

**Day 3 (Polish - 30 min):**
5. Task 3.1: Quiz ID display (15 min)
6. Task 3.2: Share link (15 min)
→ **UX polished**

---

## File Changes Summary

### Step 0: Folder Restructure
**Renamed Folders:**
- `features/quiz-maker/builder/` → `features/quiz-list/`
- `features/quiz-maker/player/` → `features/quiz-player/`
- `features/quiz-maker/results/` → `features/quiz-results/`
- Delete `features/quiz-maker/` (empty folder)

**Files with Updated Imports (estimated 30+ files):**
- All container files
- All route files in `app/(locale)/`
- All store files importing from other features
- All component files with cross-feature imports

### Task 1.1: Files to Modify
1. `core/lib/routes.ts` - Update routes (root, detail, player)
2. `app/(locale)/page.tsx` - Render QuizListContainer at root
3. `features/quiz-list/sections/create-quiz-modal/CreateQuizModal.tsx` - Convert to 2-step wizard
4. `features/quiz-list/sections/quiz-list/QuizList.tsx` - Convert cards to Tanstack table
5. `features/quiz-list/store/quiz-list.store.ts` - Update to use wizard store
6. `features/quiz-list/react-query/use-delete-question.ts` - Add invalidateQueries + toast
7. `features/quiz-player/container/Player.container.tsx` - Add anti-cheat hook (Task 2.1-2.2)
8. `features/quiz-results/sections/anti-cheat-summary/AntiCheatSummary.tsx` - Fetch & display events (Task 2.3)
9. `core/i18n/json/en/quiz-maker.json` - Add new translation keys

### Task 1.1: Files to Create
10. `features/quiz-list/store/create-wizard.store.ts` - 2-step wizard state
11. `features/quiz-list/sections/create-quiz-modal/steps/QuizMetadataStep.tsx` - Step 1
12. `features/quiz-list/sections/create-quiz-modal/steps/AddQuestionsStep.tsx` - Step 2
13. `features/quiz-list/sections/create-quiz-modal/steps/QuestionForm.tsx` - Reusable form
14. `features/quiz-list/sections/create-quiz-modal/steps/QuestionsList.tsx` - Questions preview
15. `features/quiz-detail/container/QuizDetail.container.tsx` - Detail page container (NEW FEATURE)
16. `features/quiz-detail/sections/quiz-header/QuizHeader.tsx` - Header section
17. `features/quiz-detail/sections/question-actions/QuestionActions.tsx` - Actions section
18. `features/quiz-detail/sections/question-table/QuestionTable.tsx` - Table section
19. `features/quiz-detail/store/quiz-detail.store.ts` - Detail page state
20. `app/(locale)/quiz/[id]/page.tsx` - Detail page route
21. `features/quiz-player/hooks/useAntiCheat.ts` - Anti-cheat tracking (Task 2.1-2.2)
22. `features/quiz-list/sections/quiz-summary/QuizSummary.tsx` - Quiz ID display (Task 3.1, optional)

### Files to Delete:
23. `app/(locale)/quiz-maker/builder/page.tsx` - Moved to root

**Total: 23 files** (9 modify, 13 create, 1 delete) + **30+ files** with import updates in Step 0

---

## Risk Assessment

### Low Risk (Safe to implement):
- ✅ Task 1.1 (Combined Create + Edit) - Well-defined wizard pattern + detail page (includes edit/delete)
- ✅ Task 2.1-2.2 (Anti-cheat tracking) - Standard event listeners
- ✅ Task 3.1-3.2 (Polish) - Pure UI additions

### Medium Risk:
- ⚠️ Task 2.3 (Anti-cheat display) - Depends on backend changes
  - Mitigation: Use frontend store (Option B) if backend changes not allowed

### Architecture Impact:
- ✅ No breaking changes to existing features
- ✅ Maintains Container → Section → Component pattern
- ✅ No new dependencies required

---

## Success Criteria

Before marking as "Done":
- [ ] All core requirements from take-home test implemented
- [ ] Builder: Create, Read, Update, Delete questions ✅
- [ ] Player: Load, answer, navigate, submit ✅
- [ ] Results: Score, breakdown, anti-cheat (bonus) ✅
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] All features tested manually
- [ ] README updated with setup instructions

---

## Notes for Review

**Current Architecture:**
- ✅ Clean separation: Container → Section → Component
- ✅ All API calls via React Query hooks (anti-corruption layer)
- ✅ Zustand for client state, React Query for server state
- ✅ TypeScript strict mode, no `any` types
- ✅ i18n with next-intl

**What's Working Well:**
- Player feature is 100% complete and polished
- Results feature displays score and breakdown correctly
- API integration layer is solid with React Query
- Clean architecture maintained throughout

**What's New (Updated Approach):**
- ✅ **2-Step Create Wizard**: Better alignment with take-home spec ("create quiz → add questions → save")
- ✅ **Tanstack Table**: Professional quiz list with sortable columns
- ✅ **Detail Page Route**: Scalable editing for 50+ questions
- ✅ **Combined Approach**: Best onboarding (wizard) + best editing (full page)

**Estimated Total Time to 100% Completion:**
- Preparation: 30 min (Step 0 - Restructure folders)
- Critical: 2 hours (Task 1.1 only - includes edit/delete)
- Bonus: 1.5 hours (Task 2.1-2.3)
- Polish: 0.5 hours (Task 3.1-3.2)
- **Total: 4.5 hours** (includes Step 0 preparation)

---

**Ready to implement? Priority order:**
0. ✅ **Step 0: Restructure folders first** (30 min) - **DO THIS NOW**
1. ✅ Implement combined create + edit flow (120 minutes) - **includes all CRUD**
2. ✅ Add anti-cheat bonus (90 minutes)
3. ✅ Polish UX (30 minutes)
