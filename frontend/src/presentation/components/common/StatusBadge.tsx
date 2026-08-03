import { statusLabel, statusStyle } from '@/presentation/messages/statusLabels';

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle(status)}`}
    >
      {statusLabel(status)}
    </span>
  );
}
