'use client';

import { useState, Suspense } from 'react';
import { useForm, type Resolver, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useApplicationActions } from '@/presentation/hooks/useApplicationActions';
import { useSuspenseQuery, invalidateSuspenseQuery } from '@/presentation/hooks/useSuspenseQuery';
import { SuspenseFallback } from '@/presentation/components/SuspenseFallback';
import { GetReferences } from '@/application/useCases/GetReferences';
import { ReferenceApiRepository } from '@/infrastructure/repositories/ReferenceApiRepository';
import { ApplicationNewFormStep1 } from '@/presentation/components/new-application-form/ApplicationNewFormStep1';
import { ApplicationNewFormStep2 } from '@/presentation/components/new-application-form/ApplicationNewFormStep2';
import { ApplicationNewFormStep3 } from '@/presentation/components/new-application-form/ApplicationNewFormStep3';
import type { CreateApplicationInput } from '@/domain/entities/Application';
import { newApplicationSchema, type NewApplicationFormData } from '@/presentation/validation/newApplicationSchema';
import { applicationFormLabels } from '@/presentation/messages/applicationForm';

type FormData = NewApplicationFormData;

function FormContent() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const router = useRouter();
  const { create, save } = useApplicationActions();

  const { data, error: refsError } = useSuspenseQuery(
    'new-form-references',
    () => new GetReferences(new ReferenceApiRepository()).execute(),
  );

  const references = data ?? {};

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(newApplicationSchema) as Resolver<FormData>,
    defaultValues: {
      channel: 'self-service',
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
      const ok = await trigger([
        'channel',
        'advisorId',
        'documentType',
        'documentNumber',
        'firstName',
        'lastName',
        'phone',
        'email',
        'city',
      ]);
      if (ok) setStep(2);
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

    try {
      const res = await create.execute(basic as unknown as CreateApplicationInput);
      if (!res.id) {
        setError(applicationFormLabels.createError);
        return;
      }
      await save.execute(res.id, {
        income,
        expenses,
        amount,
        term,
        purpose,
        dataAuthorized,
      });
      invalidateSuspenseQuery('applications-list-');
      router.push(`/applications/${res.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : applicationFormLabels.connectionError);
    }
  };

  if (refsError) {
    return <p className="mt-2 text-red-600">{refsError.message}</p>;
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">{applicationFormLabels.newTitle}</h1>
      {error && <p className="mt-2 text-red-600">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {step === 1 && (
          <ApplicationNewFormStep1
            register={register}
            errors={errors}
            references={references}
            watchedChannel={watched.channel ?? 'self-service'}
          />
        )}

        {step === 2 && (
          <ApplicationNewFormStep2
            register={register}
            errors={errors}
            references={references}
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
              className="rounded bg-sky-600 px-4 py-2 text-white"
            >
              {applicationFormLabels.next}
            </button>
          )}
          {step === 3 && (
            <button
              type="submit"
              className="rounded bg-sky-600 px-4 py-2 text-white"
            >
              {applicationFormLabels.create}
            </button>
          )}
        </div>
      </form>
    </main>
  );
}

export function ApplicationNewForm() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <FormContent />
    </Suspense>
  );
}
