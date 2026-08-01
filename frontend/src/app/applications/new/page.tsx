'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { createApplication } from '@/lib/api';

const schema = z.object({
  channel: z.enum(['self-service', 'advisor']),
  advisorId: z.string().optional(),
  documentType: z.string().min(1, 'Requerido'),
  documentNumber: z.string().min(1, 'Requerido'),
  firstName: z.string().min(1, 'Requerido'),
  lastName: z.string().min(1, 'Requerido'),
  phone: z.string().min(1, 'Requerido'),
  email: z.string().email('Correo inválido'),
  city: z.string().min(1, 'Requerido'),
  income: z.coerce.number().min(0, 'Debe ser positivo'),
  expenses: z.coerce.number().min(0, 'Debe ser positivo'),
  amount: z.coerce.number().min(0, 'Debe ser positivo'),
  term: z.coerce.number().int().min(1, 'Mínimo 1 mes'),
  purpose: z.string().min(1, 'Requerido'),
  dataAuthorized: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function NewApplicationPage() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      channel: 'self-service',
      income: 0,
      expenses: 0,
      amount: 0,
      term: 1,
      dataAuthorized: false,
    },
  });

  const channel = watch('channel');

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
    try {
      const res = await createApplication(data);
      if (res.id) {
        router.push(`/applications/${res.id}`);
      } else {
        setError('No se pudo crear la solicitud. Verifica los datos.');
      }
    } catch (e) {
      setError('Error de conexión con el backend.');
    }
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">Nueva solicitud</h1>
      {error && <p className="mt-2 text-red-600">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {step === 1 && (
          <section className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Canal</label>
              <select {...register('channel')} className="mt-1 w-full border rounded p-2">
                <option value="self-service">Autogestionado</option>
                <option value="advisor">Asistido</option>
              </select>
              {errors.channel && <p className="text-red-600 text-sm">{errors.channel.message}</p>}
            </div>
            {channel === 'advisor' && (
              <div>
                <label className="block text-sm font-medium">Asesor</label>
                <input {...register('advisorId')} className="mt-1 w-full border rounded p-2" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium">Tipo documento</label>
              <input {...register('documentType')} className="mt-1 w-full border rounded p-2" />
              {errors.documentType && <p className="text-red-600 text-sm">{errors.documentType.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Número documento</label>
              <input {...register('documentNumber')} className="mt-1 w-full border rounded p-2" />
              {errors.documentNumber && <p className="text-red-600 text-sm">{errors.documentNumber.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Nombres</label>
              <input {...register('firstName')} className="mt-1 w-full border rounded p-2" />
              {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Apellidos</label>
              <input {...register('lastName')} className="mt-1 w-full border rounded p-2" />
              {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Celular</label>
              <input {...register('phone')} className="mt-1 w-full border rounded p-2" />
              {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Correo</label>
              <input type="email" {...register('email')} className="mt-1 w-full border rounded p-2" />
              {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Ciudad</label>
              <input {...register('city')} className="mt-1 w-full border rounded p-2" />
              {errors.city && <p className="text-red-600 text-sm">{errors.city.message}</p>}
            </div>
            <button
              type="button"
              onClick={next}
              className="rounded bg-sky-600 px-4 py-2 text-white"
            >
              Siguiente
            </button>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Ingresos</label>
              <input type="number" {...register('income')} className="mt-1 w-full border rounded p-2" />
              {errors.income && <p className="text-red-600 text-sm">{errors.income.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Egresos</label>
              <input type="number" {...register('expenses')} className="mt-1 w-full border rounded p-2" />
              {errors.expenses && <p className="text-red-600 text-sm">{errors.expenses.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Valor solicitado</label>
              <input type="number" {...register('amount')} className="mt-1 w-full border rounded p-2" />
              {errors.amount && <p className="text-red-600 text-sm">{errors.amount.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Plazo (meses)</label>
              <input type="number" {...register('term')} className="mt-1 w-full border rounded p-2" />
              {errors.term && <p className="text-red-600 text-sm">{errors.term.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Destino</label>
              <input {...register('purpose')} className="mt-1 w-full border rounded p-2" />
              {errors.purpose && <p className="text-red-600 text-sm">{errors.purpose.message}</p>}
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" {...register('dataAuthorized')} />
              <label className="text-sm">Autorizo tratamiento de datos</label>
            </div>
            {errors.dataAuthorized && <p className="text-red-600 text-sm">{errors.dataAuthorized.message}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded border px-4 py-2"
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={next}
                className="rounded bg-sky-600 px-4 py-2 text-white"
              >
                Siguiente
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Resumen</h2>
            <p className="text-slate-700">
              Revisa la información antes de enviar.
            </p>
            <div className="space-y-2 text-sm text-slate-700">
              <p>Canal: {watch('channel')}</p>
              <p>Documento: {watch('documentType')} {watch('documentNumber')}</p>
              <p>Nombre: {watch('firstName')} {watch('lastName')}</p>
              <p>Correo: {watch('email')}</p>
              <p>Ingresos: {watch('income')} — Egresos: {watch('expenses')}</p>
              <p>Valor: {watch('amount')} — Plazo: {watch('term')} meses</p>
              <p>Destino: {watch('purpose')}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded border px-4 py-2"
              >
                Atrás
              </button>
              <button
                type="submit"
                className="rounded bg-sky-600 px-4 py-2 text-white"
              >
                Crear solicitud
              </button>
            </div>
          </section>
        )}
      </form>
    </main>
  );
}
