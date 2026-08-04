'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useApplicationEdit } from '@/presentation/hooks/useApplicationQueries';
import { useApplicationMutations } from '@/presentation/hooks/useApplicationMutations';
import { useAlert } from '@/presentation/hooks/useAlert';
import { FormField } from '@/presentation/components/forms/FormField';
import { TextareaField } from '@/presentation/components/forms/TextareaField';
import { CheckboxField } from '@/presentation/components/forms/CheckboxField';
import { FadeIn } from '@/presentation/components/common/FadeIn';
import { LoadingSpinner } from '@/presentation/components/common/LoadingSpinner';
import { formatCOP } from '@/presentation/utils/formatCOP';
import { editApplicationSchema, type EditApplicationFormData } from '@/presentation/validation/editApplicationSchema';
import { applicationFormLabels } from '@/presentation/messages/applicationForm';
import { commonMessages } from '@/presentation/messages/common';

type FormData = EditApplicationFormData;

export function ApplicationEditFormContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: app, isPending, error } = useApplicationEdit(id);
  const { save } = useApplicationMutations();
  const { success, error: showError } = useAlert();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(editApplicationSchema) as Resolver<FormData>,
    mode: 'onChange',
  });

  const watched = useWatch({ control });

  useEffect(() => {
    if (!app) return;
    if (app.status !== 'DRAFT') {
      router.replace(`/applications/${id}`);
      return;
    }
    reset({
      income: app.income,
      expenses: app.expenses,
      amount: app.amount,
      term: app.term,
      purpose: app.purpose,
      dataAuthorized: app.dataAuthorized,
    });
  }, [app, id, router, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await save.mutateAsync({ id, data });
      success('Cambios guardados');
      router.replace(`/applications/${id}`);
    } catch (err) {
      showError(err instanceof Error ? err.message : applicationFormLabels.saveError);
    }
  };

  if (isPending) {
    return <LoadingSpinner label={commonMessages.loading} />;
  }

  if (error) {
    return <p className="mt-2 text-red-600">{error.message}</p>;
  }

  if (!app) {
    return null;
  }

  if (app.status !== 'DRAFT') {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold text-slate-900">{applicationFormLabels.editTitle}</h1>
        <p className="mt-2 text-red-600">{applicationFormLabels.editNotAllowed}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <FadeIn className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-100 bg-white p-8 shadow-lg"
        >
          <h1 className="text-3xl font-bold text-slate-900">{applicationFormLabels.editTitle}</h1>
          <p className="mt-2 text-slate-500">{applicationFormLabels.editDescription}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <FormField
          id="income"
          label={applicationFormLabels.income}
          type="number"
          registration={register('income')}
          error={errors.income}
        />
        <p className="text-sm text-slate-500">{formatCOP(watched.income ?? 0)}</p>
        <FormField
          id="expenses"
          label={applicationFormLabels.expenses}
          type="number"
          registration={register('expenses')}
          error={errors.expenses}
        />
        <p className="text-sm text-slate-500">{formatCOP(watched.expenses ?? 0)}</p>
        <FormField
          id="amount"
          label={applicationFormLabels.amount}
          type="number"
          registration={register('amount')}
          error={errors.amount}
        />
        <p className="text-sm text-slate-500">{formatCOP(watched.amount ?? 0)}</p>
        <FormField
          id="term"
          label={applicationFormLabels.term}
          type="number"
          registration={register('term')}
          error={errors.term}
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
        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={() => router.replace(`/applications/${id}`)}
            className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {applicationFormLabels.cancel}
          </button>
          <button
            type="submit"
            className="ml-auto rounded-xl bg-sky-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-sky-100 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={save.isPending || !watched.dataAuthorized}
          >
            {applicationFormLabels.save}
          </button>
        </div>
        </form>
        </motion.div>
      </FadeIn>
    </main>
  );
}
