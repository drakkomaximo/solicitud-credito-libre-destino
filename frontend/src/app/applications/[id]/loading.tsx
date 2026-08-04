import { ApplicationDetailSkeleton } from '@/presentation/components/applications/skeletons/ApplicationDetailSkeleton';

export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" role="status">
      <h1 className="sr-only">Cargando solicitud</h1>
      <ApplicationDetailSkeleton />
    </div>
  );
}
