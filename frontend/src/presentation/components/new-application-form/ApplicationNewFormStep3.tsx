import { applicationFormLabels, summaryLabels } from '@/presentation/messages/applicationForm';
import type { NewApplicationFormData } from '@/presentation/validation/newApplicationSchema';

interface Step3Props {
  watched: Partial<NewApplicationFormData>;
}

export function ApplicationNewFormStep3({ watched }: Step3Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{applicationFormLabels.reviewTitle}</h2>
      <p className="text-slate-700">{applicationFormLabels.reviewDescription}</p>
      <div className="space-y-2 text-sm text-slate-700">
        <p>{summaryLabels.channel}: {watched.channel}</p>
        <p>{summaryLabels.document}: {watched.documentType} {watched.documentNumber}</p>
        <p>{summaryLabels.name}: {watched.firstName} {watched.lastName}</p>
        <p>{summaryLabels.email}: {watched.email}</p>
        <p>{summaryLabels.income}: {watched.income} — {summaryLabels.expenses}: {watched.expenses}</p>
        <p>{summaryLabels.amount}: {watched.amount} — {summaryLabels.term}: {watched.term} {summaryLabels.termSuffix}</p>
        <p>{summaryLabels.purpose}: {watched.purpose}</p>
      </div>
    </section>
  );
}
