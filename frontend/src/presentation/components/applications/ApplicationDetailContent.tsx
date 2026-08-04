'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApplicationDetail } from '@/presentation/hooks/useApplicationQueries';
import { useApplicationMutations } from '@/presentation/hooks/useApplicationMutations';
import { useAlert } from '@/presentation/hooks/useAlert';
import { detailMessages } from '@/presentation/messages/detail';
import { commonMessages } from '@/presentation/messages/common';
import { formatCOP } from '@/presentation/utils/formatCOP';
import { parseRole } from '@/presentation/utils/parseRole';
import { FadeIn } from '@/presentation/components/common/FadeIn';
import { LoadingSpinner } from '@/presentation/components/common/LoadingSpinner';
import { StatusBadge } from '@/presentation/components/common/StatusBadge';
import { CHANNEL_LABELS } from '@/presentation/constants/channels';
import { eventLabel } from '@/presentation/messages/statusLabels';
import { CookieTokenStorage } from '@/infrastructure/storage/CookieTokenStorage';

export function ApplicationDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const { data, isPending, error } = useApplicationDetail(id);
  const {
    simulate,
    finalize,
    abandon,
    decide,
  } = useApplicationMutations();

  const isSimulating = simulate.isPending;
  const isActionPending = finalize.isPending || abandon.isPending || decide.isPending;
  const { success, error: showError, confirm, confirmWithReason } = useAlert();
  const [liveSimulation, setLiveSimulation] = useState<
    | {
        status: 'approved' | 'not-viable';
        monthlyPayment?: number;
        totalPayment?: number;
        interestRate?: number;
        message?: string;
      }
    | undefined
  >(undefined);
  const role = useMemo(() => parseRole(new CookieTokenStorage().getToken()), []);

  const events = useMemo(() => data?.events ?? [], [data]);
  const app = data?.app;

  const simulation = useMemo(() => {
    if (liveSimulation) return liveSimulation;
    const lastSimulation = events.findLast((e) => e.type === 'SIMULATED');
    const payload = lastSimulation?.payload as
      | { result: 'approved' | 'not-viable'; monthlyPayment?: number; totalPayment?: number; interestRate?: number; message?: string }
      | undefined;
    if (!payload) return null;
    return {
      status: payload.result,
      monthlyPayment: payload.monthlyPayment,
      totalPayment: payload.totalPayment,
      interestRate: payload.interestRate,
      message: payload.message,
    };
  }, [events, liveSimulation]);

  const canFinalize = useMemo(() => {
    const lastSimulationIndex = events.findLastIndex((e) => e.type === 'SIMULATED');
    const lastUpdateIndex = events.findLastIndex((e) => e.type === 'UPDATED');
    const lastSimulation = lastSimulationIndex >= 0 ? events[lastSimulationIndex] : undefined;
    return (
      (lastSimulation?.payload as { result?: string } | undefined)?.result === 'approved' &&
      lastUpdateIndex < lastSimulationIndex
    );
  }, [events]);

  if (isPending) {
    return <LoadingSpinner label={commonMessages.loading} />;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error.message}</p>;
  }

  if (!app) {
    return <p className="p-6 text-slate-600">{detailMessages.loadError}</p>;
  }

  const handleSimulate = async () => {
    try {
      const res = await simulate.mutateAsync(id);
      const simulatedEvent = res.events?.findLast((e) => e.type === 'SIMULATED');
      const payload = simulatedEvent?.payload as
        | { result: 'approved' | 'not-viable'; monthlyPayment?: number; totalPayment?: number; interestRate?: number; message?: string }
        | undefined;
      if (payload) {
        setLiveSimulation({
          status: payload.result,
          monthlyPayment: payload.monthlyPayment,
          totalPayment: payload.totalPayment,
          interestRate: payload.interestRate,
          message: payload.message,
        });
      }
      success(detailMessages.simulationSuccess);
    } catch (err) {
      showError(err instanceof Error ? err.message : detailMessages.simulationError);
    }
  };

  const handleFinalize = async () => {
    const confirmed = await confirm({
      title: detailMessages.confirmFinalizeTitle,
      text: detailMessages.confirmFinalizeText,
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
    const reasonValue = await confirmWithReason({
      title: detailMessages.confirmAbandonTitle,
      text: detailMessages.confirmAbandonText,
      inputLabel: detailMessages.confirmAbandonPrompt,
      confirmButtonText: detailMessages.confirmAbandonButton,
    });
    if (reasonValue === null) return;
    try {
      await abandon.mutateAsync({ id, reason: reasonValue });
      success(detailMessages.abandonSuccess);
      router.replace(`/applications/${id}`);
    } catch (err) {
      showError(err instanceof Error ? err.message : detailMessages.abandonError);
    }
  };

  const handleApprove = async () => {
    const confirmed = await confirm({
      title: detailMessages.confirmApproveTitle,
      text: detailMessages.confirmApproveText,
      confirmButtonText: detailMessages.confirmApproveButton,
    });
    if (!confirmed) return;
    try {
      await decide.mutateAsync({ id, decision: 'APPROVED' });
      success(detailMessages.approveSuccess);
    } catch (err) {
      showError(err instanceof Error ? err.message : detailMessages.decisionError);
    }
  };

  const handleReject = async () => {
    const rejectReason = await confirmWithReason({
      title: detailMessages.confirmRejectTitle,
      text: detailMessages.confirmRejectPrompt,
      inputLabel: detailMessages.rejectReasonLabel,
      confirmButtonText: detailMessages.confirmRejectButton,
    });
    if (rejectReason === null) return;
    try {
      await decide.mutateAsync({
        id,
        decision: 'REJECTED',
        reason: rejectReason,
      });
      success(detailMessages.rejectSuccess);
    } catch (err) {
      showError(err instanceof Error ? err.message : detailMessages.decisionError);
    }
  };

  return (
    <main className="relative mx-auto max-w-3xl p-4 sm:p-6">
      <div
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl bg-white/70 backdrop-blur-sm transition-opacity duration-300 ${
          isActionPending ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <LoadingSpinner label={commonMessages.loading} />
      </div>
      <FadeIn className={`${isActionPending ? 'pointer-events-none opacity-60' : ''} transition-opacity duration-300`}>
        <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          aria-label={detailMessages.back}
        >
          {detailMessages.back}
        </button>
        <h1 className="text-xl font-extrabold text-slate-900 sm:text-3xl">
          {detailMessages.requestTitle} {app.firstName} {app.lastName}
        </h1>
        <StatusBadge status={app.status} />
      </div>

      <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-base font-bold text-slate-900 sm:text-xl">
          {detailMessages.personalSection}
        </h2>
        <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-slate-500 sm:text-sm">{detailMessages.document}</dt>
            <dd className="text-sm font-medium text-slate-800 sm:text-base">
              {app.documentType} {app.documentNumber}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 sm:text-sm">{detailMessages.phone}</dt>
            <dd className="text-sm font-medium text-slate-800 sm:text-base">{app.phone}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 sm:text-sm">{detailMessages.email}</dt>
            <dd className="text-sm font-medium text-slate-800 sm:text-base">{app.email}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 sm:text-sm">{detailMessages.city}</dt>
            <dd className="text-sm font-medium text-slate-800 sm:text-base">{app.city}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 sm:text-sm">{detailMessages.channel}</dt>
            <dd className="text-sm font-medium text-slate-800 sm:text-base">
              {CHANNEL_LABELS[app.channel as keyof typeof CHANNEL_LABELS] ?? app.channel}
            </dd>
          </div>
          {app.advisorId && (
            <div>
              <dt className="text-xs text-slate-500 sm:text-sm">{detailMessages.advisor}</dt>
              <dd className="text-sm font-medium text-slate-800 sm:text-base">{app.advisorId}</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-base font-bold text-slate-900 sm:text-xl">
          {detailMessages.financialSection}
        </h2>
        <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-slate-500 sm:text-sm">{detailMessages.amount}</dt>
            <dd className="text-sm font-medium text-slate-800 sm:text-base">{formatCOP(app.amount)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 sm:text-sm">{detailMessages.term}</dt>
            <dd className="text-sm font-medium text-slate-800 sm:text-base">
              {app.term} {detailMessages.termSuffix}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 sm:text-sm">{detailMessages.income}</dt>
            <dd className="text-sm font-medium text-slate-800 sm:text-base">{formatCOP(app.income)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 sm:text-sm">{detailMessages.expenses}</dt>
            <dd className="text-sm font-medium text-slate-800 sm:text-base">{formatCOP(app.expenses)}</dd>
          </div>
          {app.purpose && (
            <div className="sm:col-span-2">
              <dt className="text-xs text-slate-500 sm:text-sm">{detailMessages.purpose}</dt>
              <dd className="text-sm font-medium text-slate-800 sm:text-base">{app.purpose}</dd>
            </div>
          )}
        </dl>
      </section>

      {app.status === 'DRAFT' && (
        <section className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-base font-bold text-slate-900 sm:text-xl">
            {detailMessages.actionsSection}
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link
              href={`/applications/${id}/edit`}
              className="rounded-xl bg-sky-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-sky-100 transition hover:-translate-y-0.5 hover:bg-sky-700"
            >
              {detailMessages.edit}
            </Link>
            <button
              onClick={handleSimulate}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-50"
              disabled={isSimulating}
            >
              {isSimulating ? (
                <LoadingSpinner size={18} className="text-white" />
              ) : (
                detailMessages.simulate
              )}
            </button>
            {canFinalize && (
              <button
                onClick={handleFinalize}
                className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-50"
                disabled={isActionPending}
              >
                {detailMessages.finalize}
              </button>
            )}
            <button
              onClick={handleAbandon}
              className="w-full rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-100 transition hover:-translate-y-0.5 hover:bg-red-700 disabled:opacity-50 sm:w-auto sm:text-base"
              disabled={isActionPending}
            >
              {detailMessages.abandon}
            </button>
          </div>
        </section>
      )}

      {role === 'admin' && app.status === 'PENDING_VALIDATION' && (
        <section className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-base font-bold text-slate-900 sm:text-xl">
            {detailMessages.adminDecisionTitle}
          </h2>
          <p className="text-sm text-slate-600">{detailMessages.adminDecisionDescription}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={handleApprove}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-50"
              disabled={isActionPending}
            >
              {detailMessages.approve}
            </button>
            <button
              onClick={handleReject}
              className="rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-red-100 transition hover:-translate-y-0.5 hover:bg-red-700 disabled:opacity-50"
              disabled={isActionPending}
            >
              {detailMessages.reject}
            </button>
          </div>
        </section>
      )}

      {simulation && (
        <section className={`mt-4 rounded-2xl border p-4 shadow-sm sm:p-6 ${simulation.status === 'approved' ? 'border-emerald-100 bg-emerald-50' : 'border-orange-100 bg-orange-50'}`}>
          <h2 className="text-base font-bold text-slate-900 sm:text-xl">
            {detailMessages.simulationTitle}
          </h2>
          <p className="mt-2 text-sm font-semibold sm:text-base">
            {simulation.status === 'approved' ? detailMessages.simulationViable : detailMessages.simulationNotViable}
          </p>
          {simulation.status === 'approved' && (
            <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <dt className="text-xs text-slate-500">{detailMessages.monthlyPayment}</dt>
                <dd className="text-base font-semibold text-emerald-700 sm:text-lg">{formatCOP(simulation.monthlyPayment ?? 0)}</dd>
              </div>
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <dt className="text-xs text-slate-500">{detailMessages.totalPayment}</dt>
                <dd className="text-base font-semibold text-emerald-700 sm:text-lg">{formatCOP(simulation.totalPayment ?? 0)}</dd>
              </div>
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <dt className="text-xs text-slate-500">{detailMessages.interestRate}</dt>
                <dd className="text-base font-semibold text-emerald-700 sm:text-lg">{(simulation.interestRate ?? 0) * 100}% EA</dd>
              </div>
            </dl>
          )}
          {simulation.status === 'not-viable' && (
            <p className="mt-2 text-orange-800">{simulation.message ?? detailMessages.recommendationNotViable}</p>
          )}
        </section>
      )}

      <h2 className="mt-8 text-lg font-bold text-slate-900 sm:text-xl">{detailMessages.traceability}</h2>
      <ul className="mt-4 space-y-3">
        {events.map((e) => (
          <li key={e.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-800 sm:text-base">{eventLabel(e.type)}</p>
            <p className="text-sm text-slate-500">
              {new Date(e.occurredAt).toLocaleString('es-CO')}
            </p>
          </li>
        ))}
      </ul>
      </FadeIn>
    </main>
  );
}
