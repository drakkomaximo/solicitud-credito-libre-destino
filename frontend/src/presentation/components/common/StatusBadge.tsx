import { statusLabel, statusStyle } from '@/presentation/messages/statusLabels';

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold sm:px-3 sm:text-sm ${statusStyle(status)}`}
    >
      {statusLabel(status)}
    </span>
  );
}
