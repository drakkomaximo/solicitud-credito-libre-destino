import { ApplicationFormSkeleton } from '@/presentation/components/applications/skeletons/ApplicationFormSkeleton';

export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" role="status">
      <h1 className="sr-only">Cargando formulario</h1>
      <ApplicationFormSkeleton />
    </div>
  );
}
