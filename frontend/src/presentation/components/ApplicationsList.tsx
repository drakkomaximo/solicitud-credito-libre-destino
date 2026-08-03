'use client';

import { useCallback, useEffect, useRef, useState, useTransition, Suspense } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApplicationActions } from '@/presentation/hooks/useApplicationActions';
import { useSuspenseQuery } from '@/presentation/hooks/useSuspenseQuery';
import { SuspenseFallback } from '@/presentation/components/SuspenseFallback';
import { ScrollToTop } from '@/presentation/components/ScrollToTop';
import { ApplicationFilters } from '@/presentation/components/ApplicationFilters';
import { LoadingSpinner } from '@/presentation/components/LoadingSpinner';
import { listPageMessages } from '@/presentation/messages/list';
import { commonMessages } from '@/presentation/messages/common';
import type { CreditApplication, ListApplicationsResult } from '@/domain/entities/Application';

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 500;

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

function ListResults({
  role,
  status,
  channel,
  q,
}: {
  role: string;
  status: string;
  channel: string;
  q: string;
}) {
  const { list } = useApplicationActions();
  const [extraItems, setExtraItems] = useState<CreditApplication[]>([]);
  const [extraCursor, setExtraCursor] = useState<string | null>(null);
  const [extraHasMore, setExtraHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  useEffect(() => {
    resetPagination(setExtraItems, setExtraCursor, setExtraHasMore, setListError);
  }, [role, status, channel, q]);

  const { data: page, error: pageError } = useSuspenseQuery(
    `applications-list-initial-${role}-${status}-${channel}-${q}`,
    () =>
      list.execute({
        ...(status !== 'all' && { status }),
        ...(channel !== 'all' && { channel }),
        ...(q && { q }),
        limit: PAGE_SIZE,
      }),
  );

  if (pageError) {
    return <p className="mt-2 text-red-600">{pageError.message}</p>;
  }

  const initialItems = page?.data ?? [];
  const items = [...initialItems, ...extraItems];
  const cursor = extraCursor ?? page?.nextCursor ?? null;
  const hasMore = extraCursor !== null ? extraHasMore : (page?.hasNextPage ?? false);

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

  return (
    <>
      <ul className="mt-6 space-y-4">
        {items.length === 0 && <li className="text-slate-600">{listPageMessages.empty}</li>}
        {items.map((app) => (
          <li key={app.id} className="border rounded p-4">
            <Link
              href={`/applications/${app.id}`}
              className="text-lg font-medium text-sky-700"
            >
              {app.firstName} {app.lastName}
            </Link>
            <p className="text-sm text-slate-600">
              {app.documentType} {app.documentNumber} - {app.status}
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
            className="inline-flex items-center gap-2 rounded bg-sky-600 px-4 py-2 text-white disabled:opacity-60"
          >
            {loadingMore ? (
              <LoadingSpinner size={16} label={commonMessages.loading} className="text-white" />
            ) : (
              listPageMessages.loadMore
            )}
          </button>
        </div>
      )}
      <ScrollToTop />
    </>
  );
}

export function ApplicationsList({ role }: { role: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const isFirstRun = useRef(true);
  const prevRole = useRef(role);
  const [isPending, startTransition] = useTransition();

  const [status, setStatus] = useState(searchParams.get('status') ?? 'all');
  const [channel, setChannel] = useState(searchParams.get('channel') ?? 'all');
  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const [search, setSearch] = useState(searchParams.get('q') ?? '');

  const updateQuery = useCallback(
    (nextStatus: string, nextChannel: string, nextQ: string) => {
      const params = new URLSearchParams(window.location.search);
      if (nextStatus === 'all') params.delete('status');
      else params.set('status', nextStatus);
      if (nextChannel === 'all') params.delete('channel');
      else params.set('channel', nextChannel);
      if (nextQ) params.set('q', nextQ);
      else params.delete('q');
      const qs = params.toString();
      replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, replace],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== q) {
        startTransition(() => {
          setQ(search);
        });
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search, q, startTransition]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    updateQuery(status, channel, q);
  }, [status, channel, q, updateQuery]);

  const resetFilters = useCallback(() => {
    startTransition(() => {
      setStatus('all');
      setChannel('all');
      setSearch('');
      setQ('');
    });
  }, [startTransition]);

  useEffect(() => {
    if (prevRole.current !== role) {
      resetFilters();
      prevRole.current = role;
    }
  }, [role, resetFilters]);

  const changeStatus = (value: string) => startTransition(() => setStatus(value));
  const changeChannel = (value: string) => startTransition(() => setChannel(value));
  const changeSearch = (value: string) => setSearch(value);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">{listPageMessages.title}</h1>

      <ApplicationFilters
        status={status}
        channel={channel}
        search={search}
        disabled={isPending}
        onStatusChange={changeStatus}
        onChannelChange={changeChannel}
        onSearchChange={changeSearch}
        onReset={resetFilters}
      />

      <div className="relative mt-6">
        {isPending && (
          <div className="absolute inset-0 z-10 flex items-start justify-center bg-white/80 pt-10">
            <LoadingSpinner label={commonMessages.loading} />
          </div>
        )}
        <Suspense fallback={<SuspenseFallback />}>
          <ListResults role={role} status={status} channel={channel} q={q} />
        </Suspense>
      </div>
    </main>
  );
}
