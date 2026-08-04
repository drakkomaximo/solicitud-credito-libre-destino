import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormField } from '@/presentation/components/forms/FormField';
import { SelectField } from '@/presentation/components/forms/SelectField';
import { applicationFormLabels } from '@/presentation/messages/applicationForm';
import { CHANNEL_LABELS, CHANNEL_ADVISOR } from '@/presentation/constants/channels';
import { REFERENCE_DOCUMENT_TYPE } from '@/presentation/constants/referenceDomains';
import type { NewApplicationFormData } from '@/presentation/validation/newApplicationSchema';

interface Step1Props {
  register: UseFormRegister<NewApplicationFormData>;
  errors: FieldErrors<NewApplicationFormData>;
  references: Record<string, string[]>;
  watchedChannel: string;
}

export function ApplicationNewFormStep1({
  register,
  errors,
  references,
  watchedChannel,
}: Step1Props) {
  const documentTypeOptions =
    references[REFERENCE_DOCUMENT_TYPE]?.map((code) => ({
      value: code,
      label: code,
    })) ?? [];

  const channelOptions = Object.entries(CHANNEL_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <section className="space-y-6">
      <SelectField
        id="channel"
        label={applicationFormLabels.channel}
        options={channelOptions}
        error={errors.channel}
        registration={register('channel')}
      />
      {watchedChannel === CHANNEL_ADVISOR && (
        <FormField
          id="advisorId"
          label={applicationFormLabels.advisorId}
          placeholder={applicationFormLabels.advisorIdPlaceholder}
          registration={register('advisorId')}
          error={errors.advisorId}
        />
      )}
      <SelectField
        id="documentType"
        label={applicationFormLabels.documentType}
        placeholder={applicationFormLabels.selectPlaceholder}
        options={documentTypeOptions}
        error={errors.documentType}
        registration={register('documentType')}
      />
      <FormField
        id="documentNumber"
        label={applicationFormLabels.documentNumber}
        registration={register('documentNumber')}
        error={errors.documentNumber}
      />
      <FormField
        id="firstName"
        label={applicationFormLabels.firstName}
        registration={register('firstName')}
        error={errors.firstName}
      />
      <FormField
        id="lastName"
        label={applicationFormLabels.lastName}
        registration={register('lastName')}
        error={errors.lastName}
      />
      <FormField
        id="phone"
        label={applicationFormLabels.phone}
        registration={register('phone')}
        error={errors.phone}
      />
      <FormField
        id="email"
        label={applicationFormLabels.email}
        type="email"
        registration={register('email')}
        error={errors.email}
      />
      <FormField
        id="city"
        label={applicationFormLabels.city}
        registration={register('city')}
        error={errors.city}
      />
    </section>
  );
}
