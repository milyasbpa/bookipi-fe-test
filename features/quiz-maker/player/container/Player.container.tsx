'use client';

import { useParams } from 'next/navigation';

/**
 * PlayerContainer - Quiz Player Feature Container
 * 
 * Architecture: Container → Sections → Components
 * - NO props, NO state, NO business logic
 * - Only responsible for layout and rendering sections
 * - Sections handle API integration and state management
 */
export function PlayerContainer() {
  const params = useParams();
  const quizId = params?.quizId as string;

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Quiz Player</h1>
        <p className="text-muted-foreground">
          Quiz ID: {quizId || 'Loading...'}
        </p>
      </div>

      <div className="space-y-6">
        {/* Sections will be added here in Part 4 */}
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          <p>Quiz Player sections coming soon...</p>
          <p className="text-sm">Part 4: Quiz Header, Question View, Navigation</p>
        </div>
      </div>
    </div>
  );
}
