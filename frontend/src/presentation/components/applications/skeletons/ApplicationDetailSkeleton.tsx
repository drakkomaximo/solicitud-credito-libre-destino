export function ApplicationDetailSkeleton() {
  return (
    <main className="relative mx-auto max-w-3xl p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="h-10 w-24 rounded-xl bg-slate-200" />
        <div className="h-8 w-48 rounded bg-slate-200" />
        <div className="h-6 w-20 rounded-full bg-slate-200" />
      </div>

      <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="h-5 w-32 rounded bg-slate-200" />
        <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="h-3 w-16 rounded bg-slate-200" />
              <div className="h-4 w-3/4 rounded bg-slate-200" />
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="h-5 w-32 rounded bg-slate-200" />
        <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="h-3 w-16 rounded bg-slate-200" />
              <div className="h-4 w-2/3 rounded bg-slate-200" />
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="h-5 w-40 rounded bg-slate-200" />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="h-10 w-28 rounded-xl bg-slate-200" />
          <div className="h-10 w-28 rounded-xl bg-slate-200" />
          <div className="h-10 w-28 rounded-xl bg-slate-200" />
        </div>
      </section>

      <div className="mt-8 h-5 w-32 rounded bg-slate-200" />
      <ul className="mt-4 space-y-3">
        {[...Array(3)].map((_, i) => (
          <li key={i} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="h-4 w-1/3 rounded bg-slate-200" />
            <div className="mt-2 h-3 w-32 rounded bg-slate-200" />
          </li>
        ))}
      </ul>
    </main>
  );
}
