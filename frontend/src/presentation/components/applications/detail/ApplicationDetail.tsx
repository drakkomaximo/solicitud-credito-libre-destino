import { Suspense } from 'react';
import { ApplicationDetailContent } from './ApplicationDetailContent';
import { ApplicationDetailSkeleton } from '@/presentation/components/applications/skeletons/ApplicationDetailSkeleton';

export function ApplicationDetail({ id }: { id: string }) {
  return (
    <Suspense fallback={<ApplicationDetailSkeleton />}>
      <ApplicationDetailContent id={id} />
    </Suspense>
  );
}
