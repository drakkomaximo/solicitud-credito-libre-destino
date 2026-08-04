'use client';

import { Suspense } from 'react';
import { SuspenseFallback } from '@/presentation/components/common/SuspenseFallback';
import { ApplicationNewFormContent } from './ApplicationNewFormContent';

export function ApplicationNewForm() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <ApplicationNewFormContent />
    </Suspense>
  );
}
