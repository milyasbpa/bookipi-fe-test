/**
 * Layout for Quiz Maker pages.
 * Route group `(protected)` has no effect on the URL structure.
 */
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen">{children}</main>;
}
