export default function Loading() {
  return (
    <section
      className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center p-6"
      aria-busy="true"
      aria-live="polite"
      aria-atomic="true"
      role="status"
    >
      <h1 className="sr-only">Cargando contenido</h1>
      <div className="w-full max-w-3xl space-y-4">
        <div className="h-8 w-1/3 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    </section>
  );
}
