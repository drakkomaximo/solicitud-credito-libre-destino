import { Suspense } from 'react';
import { ApplicationFormSkeleton } from '@/presentation/components/applications/skeletons/ApplicationFormSkeleton';
import { ApplicationNewFormContent } from './ApplicationNewFormContent';

export function ApplicationNewForm() {
  return (
    <Suspense fallback={<ApplicationFormSkeleton />}>
      <ApplicationNewFormContent />
    </Suspense>
  );
}
