import type { ReactNode } from 'react';

export default function ApplicationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
