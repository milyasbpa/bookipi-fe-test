import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to quiz maker builder
  redirect('/quiz-maker/builder');
}
