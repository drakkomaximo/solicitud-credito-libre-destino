'use client';

import { useEffect } from 'react';
import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useApplicationEdit } from '@/presentation/hooks/useApplicationQueries';
import { useApplicationMutations } from '@/presentation/hooks/useApplicationMutations';
import { useAlert } from '@/presentation/hooks/useAlert';
import { FormField } from '@/presentation/components/forms/FormField';
import { TextareaField } from '@/presentation/components/forms/TextareaField';
import { CheckboxField } from '@/presentation/components/forms/CheckboxField';
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
      <h1 className="text-2xl font-bold text-slate-900">{applicationFormLabels.editTitle}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.replace(`/applications/${id}`)}
            className="rounded border px-4 py-2 hover:bg-slate-100"
          >
            {applicationFormLabels.cancel}
          </button>
          <button
            type="submit"
            className="rounded bg-sky-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={save.isPending || !watched.dataAuthorized}
          >
            {applicationFormLabels.save}
          </button>
        </div>
      </form>
    </main>
  );
}
