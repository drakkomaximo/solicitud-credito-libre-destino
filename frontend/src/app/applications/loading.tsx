import { ApplicationListSkeleton } from '@/presentation/components/applications/skeletons/ApplicationListSkeleton';

export default function Loading() {
  return (
    <section
      className="mx-auto w-full max-w-7xl p-4 sm:p-6"
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <h1 className="sr-only">Cargando solicitudes</h1>
      <div className="h-7 w-56 animate-pulse rounded bg-slate-200" />
      <ApplicationListSkeleton />
    </section>
  );
}
