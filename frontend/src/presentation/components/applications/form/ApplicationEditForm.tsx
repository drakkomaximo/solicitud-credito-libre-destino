'use client';

import { Suspense } from 'react';
import { ApplicationEditFormContent } from './ApplicationEditFormContent';
import { SuspenseFallback } from '@/presentation/components/common/SuspenseFallback';

export function ApplicationEditForm({ id }: { id: string }) {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <ApplicationEditFormContent id={id} />
    </Suspense>
  );
}
