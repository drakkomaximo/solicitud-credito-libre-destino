import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormField } from '@/presentation/components/forms/FormField';
import { TextareaField } from '@/presentation/components/forms/TextareaField';
import { SelectField } from '@/presentation/components/forms/SelectField';
import { CheckboxField } from '@/presentation/components/forms/CheckboxField';
import { applicationFormLabels } from '@/presentation/messages/applicationForm';
import { formatCOP } from '@/presentation/utils/formatCOP';
import { REFERENCE_CREDIT_TERM } from '@/presentation/constants/referenceDomains';
import type { NewApplicationFormData } from '@/presentation/validation/newApplicationSchema';

interface Step2Props {
  register: UseFormRegister<NewApplicationFormData>;
  errors: FieldErrors<NewApplicationFormData>;
  references: Record<string, string[]>;
  watched: Partial<NewApplicationFormData>;
}

export function ApplicationNewFormStep2({
  register,
  errors,
  references,
  watched,
}: Step2Props) {
  const termOptions =
    references[REFERENCE_CREDIT_TERM]?.map((code) => ({
      value: code,
      label: `${code} meses`,
    })) ?? [];

  return (
    <section className="space-y-6">
      <FormField
        id="income"
        label={applicationFormLabels.income}
        type="number"
        registration={register('income')}
        error={errors.income}
      />
      <p className="-mt-4 text-sm text-slate-500">{formatCOP(watched.income ?? 0)}</p>
      <FormField
        id="expenses"
        label={applicationFormLabels.expenses}
        type="number"
        registration={register('expenses')}
        error={errors.expenses}
      />
      <p className="-mt-4 text-sm text-slate-500">{formatCOP(watched.expenses ?? 0)}</p>
      <FormField
        id="amount"
        label={applicationFormLabels.amount}
        type="number"
        registration={register('amount')}
        error={errors.amount}
      />
      <p className="-mt-4 text-sm text-slate-500">{formatCOP(watched.amount ?? 0)}</p>
      <SelectField
        id="term"
        label={applicationFormLabels.term}
        placeholder={applicationFormLabels.selectPlaceholder}
        options={termOptions}
        error={errors.term}
        registration={register('term')}
      />
      <TextareaField
        id="purpose"
        label={applicationFormLabels.purpose}
        registration={register('purpose')}
        error={errors.purpose}
      />
      <CheckboxField
        id="dataAuthorized"
        label={applicationFormLabels.dataAuthorized}
        error={errors.dataAuthorized}
        registration={register('dataAuthorized')}
      />
    </section>
  );
}
