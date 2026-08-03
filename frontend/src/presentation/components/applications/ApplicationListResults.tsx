'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApplicationActions } from '@/presentation/hooks/useApplicationActions';
import { useSuspenseQuery } from '@/presentation/hooks/useSuspenseQuery';
import { LoadingSpinner } from '@/presentation/components/common/LoadingSpinner';
import { ScrollToTop } from '@/presentation/components/common/ScrollToTop';
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

export function ApplicationListResults({
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
