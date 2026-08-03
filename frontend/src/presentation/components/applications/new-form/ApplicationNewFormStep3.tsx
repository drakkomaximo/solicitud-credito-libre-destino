import { applicationFormLabels, summaryLabels } from '@/presentation/messages/applicationForm';
import { formatCOP } from '@/presentation/utils/formatCOP';
import { CHANNEL_LABELS } from '@/presentation/constants/channels';
import type { NewApplicationFormData } from '@/presentation/validation/newApplicationSchema';

interface Step3Props {
  watched: Partial<NewApplicationFormData>;
}

export function ApplicationNewFormStep3({ watched }: Step3Props) {
  const channel = watched.channel ? CHANNEL_LABELS[watched.channel] ?? watched.channel : '';

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{applicationFormLabels.reviewTitle}</h2>
      <p className="text-slate-700">{applicationFormLabels.reviewDescription}</p>
      <div className="space-y-2 text-sm text-slate-700">
        <p>{summaryLabels.channel}: {channel}</p>
        {watched.channel === 'advisor' && watched.advisorId && (
          <p>{summaryLabels.advisor}: {watched.advisorId}</p>
        )}
        <p>{summaryLabels.document}: {watched.documentType} {watched.documentNumber}</p>
        <p>{summaryLabels.name}: {watched.firstName} {watched.lastName}</p>
        <p>{summaryLabels.phone}: {watched.phone}</p>
        <p>{summaryLabels.email}: {watched.email}</p>
        <p>{summaryLabels.city}: {watched.city}</p>
        <p>{summaryLabels.income}: {formatCOP(watched.income ?? 0)} — {summaryLabels.expenses}: {formatCOP(watched.expenses ?? 0)}</p>
        <p>{summaryLabels.amount}: {formatCOP(watched.amount ?? 0)} — {summaryLabels.term}: {watched.term} {summaryLabels.termSuffix}</p>
        <p>{summaryLabels.purpose}: {watched.purpose}</p>
        <p>{summaryLabels.dataAuthorized}: {watched.dataAuthorized ? 'Sí' : 'No'}</p>
      </div>
    </section>
  );
}
