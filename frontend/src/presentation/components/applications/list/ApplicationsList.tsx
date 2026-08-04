'use client';

import { useCallback, useEffect, useRef, useState, useTransition, Suspense } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { ApplicationFilters } from '@/presentation/components/applications/list/ApplicationFilters';
import { ApplicationListResults } from '@/presentation/components/applications/list/ApplicationListResults';
import { ApplicationListSkeleton } from '@/presentation/components/applications/skeletons/ApplicationListSkeleton';
import { listPageMessages } from '@/presentation/messages/list';

const SEARCH_DEBOUNCE_MS = 500;

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
    <section>
      <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{listPageMessages.title}</h1>

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

      <div className="mt-6">
        <Suspense fallback={<ApplicationListSkeleton />}>
          <ApplicationListResults role={role} status={status} channel={channel} q={q} />
        </Suspense>
      </div>
    </section>
  );
}
