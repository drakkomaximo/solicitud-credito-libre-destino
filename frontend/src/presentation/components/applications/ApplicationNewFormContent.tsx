'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, type Resolver, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useReferences } from '@/presentation/hooks/useApplicationQueries';
import { useApplicationMutations } from '@/presentation/hooks/useApplicationMutations';
import { useAlert } from '@/presentation/hooks/useAlert';
import { ApplicationNewFormStep1 } from './new-form/ApplicationNewFormStep1';
import { ApplicationNewFormStep2 } from './new-form/ApplicationNewFormStep2';
import { ApplicationNewFormStep3 } from './new-form/ApplicationNewFormStep3';
import { FadeIn } from '@/presentation/components/common/FadeIn';
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
      success(applicationFormLabels.createSuccess);
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
    <main className="mx-auto max-w-2xl p-4 sm:p-6">
      <FadeIn className="w-full">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{applicationFormLabels.newTitle}</h1>
          <div className="mt-4 flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <motion.div
                key={s}
                initial={false}
                animate={{ backgroundColor: s <= step ? '#0284c7' : '#e2e8f0' }}
                className="h-2 flex-1 rounded-full"
              />
            ))}
          </div>
          <p className="mt-2 text-right text-sm text-slate-500">
            Paso {step} de 3
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
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
            </motion.div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="w-full rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
            >
              {applicationFormLabels.back}
            </button>
          )}
          {step < 3 && (
            <button
              type="button"
              onClick={next}
              className="w-full rounded-xl bg-sky-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-sky-100 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto sm:w-auto"
              disabled={step === 2 && !watched.dataAuthorized}
            >
              {applicationFormLabels.next}
            </button>
          )}
          {step === 3 && (
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-emerald-100 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto sm:w-auto"
              disabled={isMutating || !watched.dataAuthorized}
            >
              {applicationFormLabels.create}
            </button>
          )}
        </div>
        </form>
      </div>
    </FadeIn>
    </main>
  );
}
