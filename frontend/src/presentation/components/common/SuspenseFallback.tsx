import { commonMessages } from '@/presentation/messages/common';
import { LoadingSpinner } from './LoadingSpinner';

export function SuspenseFallback() {
  return (
    <div className="flex min-h-[20vh] items-center justify-center rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <LoadingSpinner label={commonMessages.loading} />
    </div>
  );
}
