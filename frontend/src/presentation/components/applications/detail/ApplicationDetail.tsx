'use client';

import { Suspense } from 'react';
import { ApplicationDetailContent } from './ApplicationDetailContent';
import { SuspenseFallback } from '@/presentation/components/common/SuspenseFallback';

export function ApplicationDetail({ id }: { id: string }) {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <ApplicationDetailContent id={id} />
    </Suspense>
  );
}
