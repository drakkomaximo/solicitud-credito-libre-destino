'use client';

import { useState, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useApplicationActions } from '@/presentation/hooks/useApplicationActions';
import { useSuspenseQuery } from '@/presentation/hooks/useSuspenseQuery';
import { SuspenseFallback } from '@/presentation/components/SuspenseFallback';
import { GetReferences } from '@/application/useCases/GetReferences';
import { ReferenceApiRepository } from '@/infrastructure/repositories/ReferenceApiRepository';
import { REFERENCE_STATUS, REFERENCE_CHANNEL } from '@/presentation/constants/referenceDomains';
import { STATUS_LABELS } from '@/presentation/messages/statusLabels';
import { CHANNEL_LABELS } from '@/presentation/constants/channels';
import { listPageMessages } from '@/presentation/messages/list';
import { commonMessages } from '@/presentation/messages/common';
import type { CreditApplication, ListApplicationsResult } from '@/domain/entities/Application';

const PAGE_SIZE = 10;

function resetPagination(
  setExtraItems: (v: CreditApplication[]) => void,
  setExtraCursor: (v: string | null) => void,
  setExtraHasMore: (v: boolean) => void,
  setListError: (v: string | null) => void,
) {
  setExtraItems([]);
  setExtraCursor(null);
  setExtraHasMore(false);
  setListError(null);
}

function ListContent() {
  const { list } = useApplicationActions();
  const [status, setStatus] = useState('all');
  const [channel, setChannel] = useState('all');
  const [q, setQ] = useState('');
  const [isPending, startTransition] = useTransition();

  const [extraItems, setExtraItems] = useState<CreditApplication[]>([]);
  const [extraCursor, setExtraCursor] = useState<string | null>(null);
  const [extraHasMore, setExtraHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  const { data: references } = useSuspenseQuery(
    'applications-list-references',
    () => new GetReferences(new ReferenceApiRepository()).execute(),
  );

  const { data: page, error: pageError } = useSuspenseQuery(
    `applications-list-initial-${status}-${channel}-${q}`,
    () =>
      list.execute({
        ...(status !== 'all' && { status }),
        ...(channel !== 'all' && { channel }),
        ...(q && { q }),
        limit: PAGE_SIZE,
      }),
  );

  const initialItems = page?.data ?? [];
  const items = [...initialItems, ...extraItems];
  const cursor = extraCursor ?? page?.nextCursor ?? null;
  const hasMore = extraCursor !== null ? extraHasMore : (page?.hasNextPage ?? false);

  const changeStatus = (value: string) =>
    startTransition(() => {
      resetPagination(setExtraItems, setExtraCursor, setExtraHasMore, setListError);
      setStatus(value);
    });
  const changeChannel = (value: string) =>
    startTransition(() => {
      resetPagination(setExtraItems, setExtraCursor, setExtraHasMore, setListError);
      setChannel(value);
    });
  const changeQ = (value: string) =>
    startTransition(() => {
      resetPagination(setExtraItems, setExtraCursor, setExtraHasMore, setListError);
      setQ(value);
    });

  const loadMore = async () => {
    if (!hasMore || loadingMore || !cursor) return;
    setLoadingMore(true);
    try {
      const next: ListApplicationsResult = await list.execute({
        ...(status !== 'all' && { status }),
        ...(channel !== 'all' && { channel }),
        ...(q && { q }),
        cursor,
        limit: PAGE_SIZE,
      });
      setExtraItems((prev) => [...prev, ...next.data]);
      setExtraCursor(next.nextCursor);
      setExtraHasMore(next.hasNextPage);
    } catch (err) {
      setListError(err instanceof Error ? err.message : listPageMessages.loadError);
    } finally {
      setLoadingMore(false);
    }
  };

  if (pageError) {
    return <p className="mt-2 text-red-600">{pageError.message}</p>;
  }

  const referencesMap = references ?? {};
  const statusOptions = referencesMap[REFERENCE_STATUS] ?? [];
  const channelOptions = referencesMap[REFERENCE_CHANNEL] ?? [];

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">{listPageMessages.title}</h1>
      {isPending && <p className="mt-2 text-slate-600">{commonMessages.loading}</p>}
      <div className="mt-4 flex flex-wrap gap-4">
        <select
          value={status}
          onChange={(e) => changeStatus(e.target.value)}
          className="border rounded p-2"
          aria-label={listPageMessages.allStatuses}
        >
          <option value="all">{listPageMessages.allStatuses}</option>
          {statusOptions.map((code) => (
            <option key={code} value={code}>
              {STATUS_LABELS[code] ?? code}
            </option>
          ))}
        </select>
        <select
          value={channel}
          onChange={(e) => changeChannel(e.target.value)}
          className="border rounded p-2"
          aria-label={listPageMessages.allChannels}
        >
          <option value="all">{listPageMessages.allChannels}</option>
          {channelOptions.map((code) => (
            <option key={code} value={code}>
              {CHANNEL_LABELS[code] ?? code}
            </option>
          ))}
        </select>
        <input
          value={q}
          onChange={(e) => changeQ(e.target.value)}
          placeholder={listPageMessages.searchPlaceholder}
          className="border rounded p-2"
          aria-label={listPageMessages.searchPlaceholder}
        />
      </div>
      <ul className="mt-6 space-y-4">
        {items.length === 0 && (
          <li className="text-slate-600">{listPageMessages.empty}</li>
        )}
        {items.map((app) => (
          <li key={app.id} className="border rounded p-4">
            <Link
              href={`/applications/${app.id}`}
              className="text-lg font-medium text-sky-700"
            >
              {app.firstName} {app.lastName}
            </Link>
            <p className="text-sm text-slate-600">
              {app.documentType} {app.documentNumber} — {app.status}
            </p>
          </li>
        ))}
      </ul>
      {listError && <p className="mt-4 text-red-600">{listError}</p>}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded bg-sky-600 px-4 py-2 text-white disabled:opacity-60"
          >
            {loadingMore ? commonMessages.loading : listPageMessages.loadMore}
          </button>
        </div>
      )}
    </main>
  );
}

export function ApplicationsList() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <ListContent />
    </Suspense>
  );
}
