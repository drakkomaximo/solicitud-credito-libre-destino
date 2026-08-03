'use client';

import { useState } from 'react';
import { useForm, type Resolver, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useReferences } from '@/presentation/hooks/useApplicationQueries';
import { useApplicationMutations } from '@/presentation/hooks/useApplicationMutations';
import { useAlert } from '@/presentation/hooks/useAlert';
import { ApplicationNewFormStep1 } from './new-form/ApplicationNewFormStep1';
import { ApplicationNewFormStep2 } from './new-form/ApplicationNewFormStep2';
import { ApplicationNewFormStep3 } from './new-form/ApplicationNewFormStep3';
import { LoadingSpinner } from '@/presentation/components/common/LoadingSpinner';
import type { CreateApplicationInput } from '@/domain/entities/Application';
import { newApplicationSchema, type NewApplicationFormData } from '@/presentation/validation/newApplicationSchema';
import { applicationFormLabels } from '@/presentation/messages/applicationForm';
import { CHANNEL_ADVISOR } from '@/presentation/constants/channels';
import { normalizePhone } from '@/presentation/utils/normalizePhone';

type FormData = NewApplicationFormData;

export function ApplicationNewFormContent() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { data: references, isPending: isRefsPending, error: refsError } = useReferences();
  const { create, save, isPending: isMutating } = useApplicationMutations();
  const { success, error: showError } = useAlert();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(newApplicationSchema) as Resolver<FormData>,
    mode: 'onChange',
    shouldUnregister: false,
    defaultValues: {
      channel: 'self-service',
      advisorId: '',
      income: 0,
      expenses: 0,
      amount: 0,
      term: 1,
      dataAuthorized: false,
    },
  });

  const watched = useWatch({ control });

  const next = async () => {
    if (step === 1) {
      const fieldsOk = await trigger([
        'channel',
        'documentType',
        'documentNumber',
        'firstName',
        'lastName',
        'phone',
        'email',
        'city',
      ]);
      const advisorOk =
        watched.channel !== CHANNEL_ADVISOR || Boolean(watched.advisorId?.trim());
      if (!advisorOk) {
        await trigger('advisorId');
      }
      if (fieldsOk && advisorOk) setStep(2);
    } else if (step === 2) {
      const ok = await trigger([
        'income',
        'expenses',
        'amount',
        'term',
        'purpose',
        'dataAuthorized',
      ]);
      if (ok) setStep(3);
    }
  };

  const onSubmit = async (data: FormData) => {
    const {
      income,
      expenses,
      amount,
      term,
      purpose,
      dataAuthorized,
      ...basic
    } = data;

    (basic as NewApplicationFormData).phone = normalizePhone(basic.phone);

    try {
      const res = await create.mutateAsync(basic as unknown as CreateApplicationInput);
      if (!res.id) {
        showError(applicationFormLabels.createError);
        return;
      }
      await save.mutateAsync({
        id: res.id,
        data: { income, expenses, amount, term, purpose, dataAuthorized },
      });
      success('Solicitud creada');
      router.replace(`/applications/${res.id}`);
    } catch (e) {
      showError(e instanceof Error ? e.message : applicationFormLabels.connectionError);
    }
  };

  if (isRefsPending) {
    return <LoadingSpinner label={applicationFormLabels.loadingReferences} />;
  }

  if (refsError) {
    return <p className="mt-2 text-red-600">{refsError.message}</p>;
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">{applicationFormLabels.newTitle}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {step === 1 && (
          <ApplicationNewFormStep1
            register={register}
            errors={errors}
            references={references ?? {}}
            watchedChannel={watched.channel ?? 'self-service'}
          />
        )}

        {step === 2 && (
          <ApplicationNewFormStep2
            register={register}
            errors={errors}
            references={references ?? {}}
            watched={watched}
          />
        )}

        {step === 3 && <ApplicationNewFormStep3 watched={watched} />}

        <div className="flex gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="rounded border px-4 py-2"
            >
              {applicationFormLabels.back}
            </button>
          )}
          {step < 3 && (
            <button
              type="button"
              onClick={next}
              className="rounded bg-sky-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={step === 2 && !watched.dataAuthorized}
            >
              {applicationFormLabels.next}
            </button>
          )}
          {step === 3 && (
            <button
              type="submit"
              className="rounded bg-sky-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isMutating || !watched.dataAuthorized}
            >
              {applicationFormLabels.create}
            </button>
          )}
        </div>
      </form>
    </main>
  );
}
