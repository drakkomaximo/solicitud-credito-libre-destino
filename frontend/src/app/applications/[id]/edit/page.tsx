'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { getApplication, updateApplication } from '@/lib/api';
import type { CreditApplication } from '@/types/application';

const schema = z.object({
  income: z.coerce.number().min(0, 'Debe ser positivo'),
  expenses: z.coerce.number().min(0, 'Debe ser positivo'),
  amount: z.coerce.number().min(0, 'Debe ser positivo'),
  term: z.coerce.number().int().min(1, 'Mínimo 1 mes'),
  purpose: z.string().min(1, 'Requerido'),
  dataAuthorized: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function EditApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
  });

  useEffect(() => {
    const load = async () => {
      const app: CreditApplication = await getApplication(id);
      reset({
        income: app.income,
        expenses: app.expenses,
        amount: app.amount,
        term: app.term,
        purpose: app.purpose,
        dataAuthorized: app.dataAuthorized,
      });
    };
    load();
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    await updateApplication(id, data);
    router.push(`/applications/${id}`);
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">Complementar solicitud</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Ingresos</label>
          <input
            type="number"
            {...register('income')}
            className="mt-1 w-full border rounded p-2"
          />
          {errors.income && (
            <p className="text-red-600 text-sm">{errors.income.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Egresos</label>
          <input
            type="number"
            {...register('expenses')}
            className="mt-1 w-full border rounded p-2"
          />
          {errors.expenses && (
            <p className="text-red-600 text-sm">{errors.expenses.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Valor solicitado</label>
          <input
            type="number"
            {...register('amount')}
            className="mt-1 w-full border rounded p-2"
          />
          {errors.amount && (
            <p className="text-red-600 text-sm">{errors.amount.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Plazo (meses)</label>
          <input
            type="number"
            {...register('term')}
            className="mt-1 w-full border rounded p-2"
          />
          {errors.term && (
            <p className="text-red-600 text-sm">{errors.term.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Destino</label>
          <input
            {...register('purpose')}
            className="mt-1 w-full border rounded p-2"
          />
          {errors.purpose && (
            <p className="text-red-600 text-sm">{errors.purpose.message}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register('dataAuthorized')} />
          <label className="text-sm">Autorizo tratamiento de datos</label>
        </div>
        <button
          type="submit"
          className="rounded bg-sky-600 px-4 py-2 text-white"
        >
          Guardar cambios
        </button>
      </form>
    </main>
  );
}
