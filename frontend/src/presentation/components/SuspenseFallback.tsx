import { commonMessages } from '@/presentation/messages/common';

export function SuspenseFallback() {
  return (
    <div className="p-6 text-center text-slate-600">
      {commonMessages.loading}
    </div>
  );
}
