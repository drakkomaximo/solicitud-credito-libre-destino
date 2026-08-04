import { Suspense } from 'react';
import { ApplicationEditFormContent } from './ApplicationEditFormContent';
import { ApplicationFormSkeleton } from '@/presentation/components/applications/skeletons/ApplicationFormSkeleton';

export function ApplicationEditForm({ id }: { id: string }) {
  return (
    <Suspense fallback={<ApplicationFormSkeleton />}>
      <ApplicationEditFormContent id={id} />
    </Suspense>
  );
}
