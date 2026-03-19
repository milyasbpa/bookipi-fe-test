'use client';

import { useParams } from 'next/navigation';

/**
 * ResultsContainer - Quiz Results Feature Container
 * 
 * Architecture: Container → Sections → Components
 * - NO props, NO state, NO business logic
 * - Only responsible for layout and rendering sections
 * - Sections handle API integration and state management
 */
export function ResultsContainer() {
  const params = useParams();
  const attemptId = params?.attemptId as string;

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Quiz Results</h1>
        <p className="text-muted-foreground">
          Attempt ID: {attemptId || 'Loading...'}
        </p>
      </div>

      <div className="space-y-6">
        {/* Sections will be added here in Part 6 */}
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          <p>Quiz Results sections coming soon...</p>
          <p className="text-sm">Part 6: Score Display, Question Breakdown, Anti-Cheat Summary</p>
        </div>
      </div>
    </div>
  );
}
