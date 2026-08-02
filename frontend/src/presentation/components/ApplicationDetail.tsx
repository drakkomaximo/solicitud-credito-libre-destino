'use client';

import { useState, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useApplicationActions } from '@/presentation/hooks/useApplicationActions';
import { useSuspenseQuery } from '@/presentation/hooks/useSuspenseQuery';
import { SuspenseFallback } from '@/presentation/components/SuspenseFallback';
import { detailMessages } from '@/presentation/messages/detail';

function DetailContent({ id }: { id: string }) {
  const { get, getEvents, simulate, finalize, abandon } = useApplicationActions();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [simulation, setSimulation] = useState<{ amount: number; term: number; status: string } | null>(null);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  const { data, error } = useSuspenseQuery(
    `application-detail-${id}-${refreshKey}`,
    () =>
      Promise.all([get.execute(id), getEvents.execute(id)]).then(([app, events]) => ({ app, events })),
  );

  if (error) {
    return <p className="p-6 text-red-600">{error.message}</p>;
  }

  const app = data?.app;
  const events = data?.events ?? [];
  if (!app) {
    return <p className="p-6 text-slate-600">{detailMessages.loading}</p>;
  }

  const refresh = () => startTransition(() => setRefreshKey((k) => k + 1));

  const handleSimulate = async () => {
    try {
      const res = await simulate.execute(id);
      setSimulation(res);
      refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : detailMessages.simulationError);
    }
  };

  const handleFinalize = async () => {
    try {
      await finalize.execute(id);
      setMessage(detailMessages.finalizeSuccess);
      refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : detailMessages.finalizeError);
    }
  };

  const handleAbandon = async () => {
    if (!reason) {
      setMessage(detailMessages.missingReason);
      return;
    }
    try {
      await abandon.execute(id, reason);
      setMessage(detailMessages.abandonSuccess);
      setReason('');
      refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : detailMessages.abandonError);
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">
        {detailMessages.requestTitle} {app.firstName} {app.lastName}
      </h1>
      <p className="mt-2 text-slate-700">
        {detailMessages.status}: <span className="font-semibold">{app.status}</span>
      </p>
      <p className="text-slate-700">{detailMessages.channel}: {app.channel}</p>
      <p className="text-slate-700">
        {detailMessages.phone}: {app.phone}
      </p>
      <p className="text-slate-700">
        {detailMessages.document}: {app.documentType} {app.documentNumber}
      </p>
      <p className="text-slate-700">
        {detailMessages.amount}: ${app.amount} — {detailMessages.term}: {app.term} {detailMessages.termSuffix}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {app.status === 'DRAFT' && (
          <Link
            href={`/applications/${id}/edit`}
            className="rounded bg-sky-600 px-4 py-2 text-white"
          >
            {detailMessages.edit}
          </Link>
        )}
        <button
          onClick={handleSimulate}
          className="rounded bg-emerald-600 px-4 py-2 text-white"
          disabled={isPending}
        >
          {detailMessages.simulate}
        </button>
        <button
          onClick={handleFinalize}
          className="rounded bg-blue-600 px-4 py-2 text-white"
          disabled={isPending}
        >
          {detailMessages.finalize}
        </button>
        <div className="flex items-center gap-2">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={detailMessages.reasonPlaceholder}
            className="border rounded p-2"
            aria-label={detailMessages.reasonPlaceholder}
          />
          <button
            onClick={handleAbandon}
            className="rounded bg-red-600 px-4 py-2 text-white"
            disabled={isPending}
          >
            {detailMessages.abandon}
          </button>
        </div>
      </div>

      {message && <p className="mt-4 text-green-600">{message}</p>}

      {simulation && (
        <div className="mt-4 p-4 border rounded bg-slate-50">
          <p className="font-semibold">{detailMessages.simulationTitle}: {simulation.status}</p>
          {simulation.amount && (
            <p>{detailMessages.requestedValue}: ${simulation.amount} — {detailMessages.term}: {simulation.term} {detailMessages.termSuffix}</p>
          )}
        </div>
      )}

      <h2 className="mt-8 text-xl font-bold text-slate-900">{detailMessages.traceability}</h2>
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

export function ApplicationDetail({ id }: { id: string }) {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <DetailContent id={id} />
    </Suspense>
  );
}
