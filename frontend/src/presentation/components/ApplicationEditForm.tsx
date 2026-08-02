'use client';

import { Suspense, useState } from 'react';
import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApplicationActions } from '@/presentation/hooks/useApplicationActions';
import { useSuspenseQuery } from '@/presentation/hooks/useSuspenseQuery';
import { SuspenseFallback } from '@/presentation/components/SuspenseFallback';
import { FormField } from '@/presentation/components/forms/FormField';
import { TextareaField } from '@/presentation/components/forms/TextareaField';
import { CheckboxField } from '@/presentation/components/forms/CheckboxField';
import { formatCOP } from '@/presentation/utils/formatCOP';
import { editApplicationSchema, type EditApplicationFormData } from '@/presentation/validation/editApplicationSchema';
import { applicationFormLabels } from '@/presentation/messages/applicationForm';

type FormData = EditApplicationFormData;

function FormContent({ id }: { id: string }) {
  const router = useRouter();
  const { get, save } = useApplicationActions();
  const [formError, setFormError] = useState('');

  const { data: app, error } = useSuspenseQuery(`edit-form-${id}`, () => get.execute(id));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(editApplicationSchema) as Resolver<FormData>,
    defaultValues: app
      ? {
          income: app.income,
          expenses: app.expenses,
          amount: app.amount,
          term: app.term,
          purpose: app.purpose,
          dataAuthorized: app.dataAuthorized,
        }
      : undefined,
  });

  const watched = useWatch({ control });

  const onSubmit = async (data: FormData) => {
    try {
      await save.execute(id, data);
      router.push(`/applications/${id}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : applicationFormLabels.saveError);
    }
  };

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
        <Link
          href={`/applications/${id}`}
          className="mt-4 inline-block rounded border px-4 py-2"
        >
          {applicationFormLabels.back}
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">{applicationFormLabels.editTitle}</h1>
      {formError && <p className="mt-2 text-red-600">{formError}</p>}
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
        <button
          type="submit"
          className="rounded bg-sky-600 px-4 py-2 text-white"
        >
          {applicationFormLabels.save}
        </button>
      </form>
    </main>
  );
}

export function ApplicationEditForm({ id }: { id: string }) {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <FormContent id={id} />
    </Suspense>
  );
}
