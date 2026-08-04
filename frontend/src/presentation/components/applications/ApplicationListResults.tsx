'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useApplicationActions } from '@/presentation/hooks/useApplicationActions';
import { useApplicationList } from '@/presentation/hooks/useApplicationQueries';
import { LoadingSpinner } from '@/presentation/components/common/LoadingSpinner';
import { ScrollToTop } from '@/presentation/components/common/ScrollToTop';
import { StatusBadge } from '@/presentation/components/common/StatusBadge';
import { listPageMessages } from '@/presentation/messages/list';
import { commonMessages } from '@/presentation/messages/common';
import { formatCOP } from '@/presentation/utils/formatCOP';
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
  const { data: page, isPending, error: pageError } = useApplicationList({
    role,
    status,
    channel,
    q,
  });
  const [extraItems, setExtraItems] = useState<CreditApplication[]>([]);
  const [extraCursor, setExtraCursor] = useState<string | null>(null);
  const [extraHasMore, setExtraHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  useEffect(() => {
    resetPagination(setExtraItems, setExtraCursor, setExtraHasMore, setListError);
  }, [role, status, channel, q]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-white p-12 shadow-sm">
        <LoadingSpinner size={28} label={commonMessages.loading} />
      </div>
    );
  }

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
        {items.map((app, i) => (
          <motion.li
            key={app.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link
                href={`/applications/${app.id}`}
                className="text-lg font-semibold text-sky-700 hover:underline"
              >
                {app.firstName} {app.lastName}
              </Link>
              <StatusBadge status={app.status} />
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {app.documentType} {app.documentNumber}
            </p>
            <p className="mt-2 text-sm font-medium text-slate-700">
              {formatCOP(app.amount)} · {app.term} meses
            </p>
          </motion.li>
        ))}
      </ul>
      {listError && <p className="mt-4 text-red-600">{listError}</p>}
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white shadow-md shadow-sky-100 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMore ? (
              <LoadingSpinner size={18} label={commonMessages.loading} className="text-white" />
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
