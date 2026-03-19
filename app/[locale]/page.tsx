import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to quiz list - no auth required (bearer token handled by axios)
  redirect('/quizzes');
}
