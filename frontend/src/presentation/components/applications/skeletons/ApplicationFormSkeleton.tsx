'use client';

export function ApplicationFormSkeleton() {
  return (
    <main className="mx-auto w-full max-w-2xl p-3 sm:p-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-lg sm:p-8">
        <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200 sm:h-9" />
        <div className="mt-4 flex items-center gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-2.5 flex-1 animate-pulse rounded-full bg-slate-200"
            />
          ))}
        </div>
        <div className="mt-3 h-4 w-28 animate-pulse rounded bg-slate-200" />
        <div className="mt-8 space-y-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-11 w-full animate-pulse rounded-xl bg-slate-200" />
          ))}
          <div className="h-20 w-full animate-pulse rounded-xl bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
        <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row">
          <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200 sm:w-28" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200 sm:ml-auto sm:w-32" />
        </div>
      </div>
    </main>
  );
}
