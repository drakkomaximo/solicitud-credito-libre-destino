'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getApplication,
  getApplicationEvents,
  simulateOffer,
  finalizeApplication,
  abandonApplication,
} from '@/lib/api';
import type { CreditApplication, ApplicationEvent } from '@/types/application';

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [app, setApp] = useState<CreditApplication | null>(null);
  const [events, setEvents] = useState<ApplicationEvent[]>([]);
  const [simulation, setSimulation] = useState<any>(null);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    const data = await getApplication(id);
    setApp(data);
    const evs = await getApplicationEvents(id);
    setEvents(Array.isArray(evs) ? evs : []);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!app) {
    return <p className="p-6">Cargando...</p>;
  }

  const handleSimulate = async () => {
    const res = await simulateOffer(id);
    setSimulation(res);
    load();
  };

  const handleFinalize = async () => {
    await finalizeApplication(id);
    setMessage('Solicitud enviada a validación.');
    load();
  };

  const handleAbandon = async () => {
    if (!reason) {
      setMessage('Indica el motivo de abandono.');
      return;
    }
    await abandonApplication(id, { reason });
    setMessage('Solicitud abandonada.');
    setReason('');
    load();
  };

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">
        Solicitud de {app.firstName} {app.lastName}
      </h1>
      <p className="mt-2 text-slate-700">
        Estado: <span className="font-semibold">{app.status}</span>
      </p>
      <p className="text-slate-700">Canal: {app.channel}</p>
      <p className="text-slate-700">
        Documento: {app.documentType} {app.documentNumber}
      </p>
      <p className="text-slate-700">
        Valor: ${app.amount} — Plazo: {app.term} meses
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={`/applications/${id}/edit`}
          className="rounded bg-sky-600 px-4 py-2 text-white"
        >
          Editar
        </Link>
        <button
          onClick={handleSimulate}
          className="rounded bg-emerald-600 px-4 py-2 text-white"
        >
          Simular oferta
        </button>
        <button
          onClick={handleFinalize}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Finalizar
        </button>
        <div className="flex items-center gap-2">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Motivo"
            className="border rounded p-2"
          />
          <button
            onClick={handleAbandon}
            className="rounded bg-red-600 px-4 py-2 text-white"
          >
            Abandonar
          </button>
        </div>
      </div>

      {message && <p className="mt-4 text-green-600">{message}</p>}

      {simulation && (
        <div className="mt-4 p-4 border rounded bg-slate-50">
          <p className="font-semibold">Resultado simulación: {simulation.status}</p>
          {simulation.monthlyPayment && (
            <p>Cuota mensual: ${simulation.monthlyPayment}</p>
          )}
          {simulation.totalPayment && (
            <p>Total a pagar: ${simulation.totalPayment}</p>
          )}
          {simulation.message && <p>{simulation.message}</p>}
        </div>
      )}

      <h2 className="mt-8 text-xl font-bold text-slate-900">Trazabilidad</h2>
      <ul className="mt-2 space-y-2">
        {events.map((e) => (
          <li key={e.id} className="border rounded p-2">
            <p className="font-medium">{e.type}</p>
            <p className="text-sm text-slate-500">
              {new Date(e.occurredAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
