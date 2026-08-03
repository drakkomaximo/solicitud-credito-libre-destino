'use client';

import { Suspense } from 'react';
import { ApplicationNewFormContent } from './ApplicationNewFormContent';
import { SuspenseFallback } from '@/presentation/components/common/SuspenseFallback';

export function ApplicationNewForm() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <ApplicationNewFormContent />
    </Suspense>
  );
}
