'use client';

export function ApplicationListSkeleton() {
  return (
    <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <li
          key={i}
          className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex min-w-0 flex-col gap-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
            <div className="flex flex-wrap items-center gap-2">
              <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200" />
              <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-1 border-t border-slate-100 pt-3">
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
          </div>
        </li>
      ))}
    </ul>
  );
}
