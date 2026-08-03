'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApplicationDetail } from '@/presentation/hooks/useApplicationQueries';
import { useApplicationMutations } from '@/presentation/hooks/useApplicationMutations';
import { useAlert } from '@/presentation/hooks/useAlert';
import { detailMessages } from '@/presentation/messages/detail';
import { commonMessages } from '@/presentation/messages/common';
import { formatCOP } from '@/presentation/utils/formatCOP';
import { LoadingSpinner } from '@/presentation/components/common/LoadingSpinner';

export function ApplicationDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const { data, isPending, error } = useApplicationDetail(id);
  const { simulate, finalize, abandon, isPending: isMutating } = useApplicationMutations();
  const { success, error: showError, confirm, confirmDanger } = useAlert();
  const [simulation, setSimulation] = useState<{ amount: number; term: number; status: string } | null>(null);
  const [reason, setReason] = useState('');

  if (isPending) {
    return <LoadingSpinner label={commonMessages.loading} />;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error.message}</p>;
  }

  const app = data?.app;
  const events = data?.events ?? [];
  if (!app) {
    return <p className="p-6 text-slate-600">{detailMessages.loadError}</p>;
  }

  const hasApprovedSimulation = events.some(
    (e) => e.type === 'SIMULATED' && (e.payload as { result?: string } | undefined)?.result === 'approved',
  );

  const handleSimulate = async () => {
    try {
      const res = await simulate.mutateAsync(id);
      setSimulation(res);
      success('Simulación realizada');
    } catch (err) {
      showError(err instanceof Error ? err.message : detailMessages.simulationError);
    }
  };

  const handleFinalize = async () => {
    const confirmed = await confirm({
      title: 'Finalizar solicitud',
      text: '¿Enviar la solicitud a validación? Una vez finalizada no podrá editarla.',
    });
    if (!confirmed) return;
    try {
      await finalize.mutateAsync(id);
      success(detailMessages.finalizeSuccess);
      router.replace(`/applications/${id}`);
    } catch (err) {
      showError(err instanceof Error ? err.message : detailMessages.finalizeError);
    }
  };

  const handleAbandon = async () => {
    if (!reason) {
      showError(detailMessages.missingReason);
      return;
    }
    const confirmed = await confirmDanger({
      title: 'Abandonar solicitud',
      text: '¿Confirmas que deseas abandonar esta solicitud?',
    });
    if (!confirmed) return;
    try {
      await abandon.mutateAsync({ id, reason });
      success(detailMessages.abandonSuccess);
      setReason('');
      router.replace(`/applications/${id}`);
    } catch (err) {
      showError(err instanceof Error ? err.message : detailMessages.abandonError);
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border px-3 py-1 text-sm hover:bg-slate-100"
          aria-label={detailMessages.back}
        >
          {detailMessages.back}
        </button>
        <h1 className="text-2xl font-bold text-slate-900">
          {detailMessages.requestTitle} {app.firstName} {app.lastName}
        </h1>
      </div>
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
        {detailMessages.amount}: {formatCOP(app.amount)} — {detailMessages.term}: {app.term} {detailMessages.termSuffix}
      </p>

      {app.status === 'DRAFT' && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/applications/${id}/edit`}
            className="rounded bg-sky-600 px-4 py-2 text-white"
          >
            {detailMessages.edit}
          </Link>
          <button
            onClick={handleSimulate}
            className="rounded bg-emerald-600 px-4 py-2 text-white"
            disabled={isMutating}
          >
            {detailMessages.simulate}
          </button>
          {hasApprovedSimulation && (
            <button
              onClick={handleFinalize}
              className="rounded bg-blue-600 px-4 py-2 text-white"
              disabled={isMutating}
            >
              {detailMessages.finalize}
            </button>
          )}
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
              disabled={isMutating}
            >
              {detailMessages.abandon}
            </button>
          </div>
        </div>
      )}

      {simulation && (
        <div className="mt-4 p-4 border rounded bg-slate-50">
          <p className="font-semibold">{detailMessages.simulationTitle}: {simulation.status}</p>
          {simulation.amount && (
            <p>{detailMessages.requestedValue}: {formatCOP(simulation.amount)} — {detailMessages.term}: {simulation.term} {detailMessages.termSuffix}</p>
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
