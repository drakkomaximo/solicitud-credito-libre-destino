'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useApplicationActions } from '@/presentation/hooks/useApplicationActions';
import { useApplicationList } from '@/presentation/hooks/useApplicationQueries';
import { LoadingSpinner } from '@/presentation/components/common/LoadingSpinner';
import { ApplicationListSkeleton } from '@/presentation/components/applications/skeletons/ApplicationListSkeleton';
import { ScrollToTop } from '@/presentation/components/common/ScrollToTop';
import { StatusBadge } from '@/presentation/components/common/StatusBadge';
import { listPageMessages } from '@/presentation/messages/list';
import { commonMessages } from '@/presentation/messages/common';
import { formatCOP } from '@/presentation/utils/formatCOP';
import { CHANNEL_LABELS } from '@/presentation/constants/channels';
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
    return <ApplicationListSkeleton />;
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
      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.length === 0 && <li className="col-span-full text-slate-600">{listPageMessages.empty}</li>}
        {items.map((app, i) => {
          const channel = CHANNEL_LABELS[app.channel as keyof typeof CHANNEL_LABELS] ?? app.channel;
          const isSelfService = app.channel === 'self-service';
          const createdAt = new Date(app.createdAt).toLocaleString('es-CO', {
            dateStyle: 'short',
            timeStyle: 'short',
          });
          return (
            <motion.li
              key={app.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
            >
              <Link
                href={`/applications/${app.id}`}
                className="group flex h-full flex-col"
              >
                <div className="flex min-w-0 flex-col gap-2">
                  <h3 className="truncate text-sm font-semibold text-sky-700 group-hover:underline sm:text-base">
                    {app.firstName} {app.lastName}
                  </h3>
                  <p className="text-xs text-slate-600 sm:text-sm">
                    {app.documentType} {app.documentNumber}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={app.status} />
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${
                        isSelfService
                          ? 'border-sky-200 bg-sky-50 text-sky-700'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {channel}
                    </span>
                  </div>
                </div>
                <div className="mt-auto flex flex-col gap-1 border-t border-slate-100 pt-3 text-xs text-slate-700 sm:text-sm">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium">{formatCOP(app.amount)}</span>
                    <span className="text-slate-300">·</span>
                    <span>{app.term} meses</span>
                  </div>
                  <span className="text-xs text-slate-400">{createdAt}</span>
                </div>
              </Link>
            </motion.li>
          );
        })}
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
