import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormField } from '@/presentation/components/forms/FormField';
import { SelectField } from '@/presentation/components/forms/SelectField';
import { CheckboxField } from '@/presentation/components/forms/CheckboxField';
import { applicationFormLabels } from '@/presentation/messages/applicationForm';
import { REFERENCE_CREDIT_TERM } from '@/presentation/constants/referenceDomains';
import type { NewApplicationFormData } from '@/presentation/validation/newApplicationSchema';

interface Step2Props {
  register: UseFormRegister<NewApplicationFormData>;
  errors: FieldErrors<NewApplicationFormData>;
  references: Record<string, string[]>;
}

export function ApplicationNewFormStep2({
  register,
  errors,
  references,
}: Step2Props) {
  const termOptions =
    references[REFERENCE_CREDIT_TERM]?.map((code) => ({
      value: code,
      label: `${code} meses`,
    })) ?? [];

  return (
    <section className="space-y-4">
      <FormField
        id="income"
        label={applicationFormLabels.income}
        type="number"
        registration={register('income')}
        error={errors.income}
      />
      <FormField
        id="expenses"
        label={applicationFormLabels.expenses}
        type="number"
        registration={register('expenses')}
        error={errors.expenses}
      />
      <FormField
        id="amount"
        label={applicationFormLabels.amount}
        type="number"
        registration={register('amount')}
        error={errors.amount}
      />
      <SelectField
        id="term"
        label={applicationFormLabels.term}
        placeholder={applicationFormLabels.selectPlaceholder}
        options={termOptions}
        error={errors.term}
        registration={register('term')}
      />
      <FormField
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
