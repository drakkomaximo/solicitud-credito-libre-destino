import { commonMessages } from '@/presentation/messages/common';
import { LoadingSpinner } from './LoadingSpinner';

export function SuspenseFallback() {
  return (
    <div className="p-6 text-center">
      <LoadingSpinner label={commonMessages.loading} />
    </div>
  );
}
