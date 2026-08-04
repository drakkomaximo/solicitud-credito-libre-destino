import Link from 'next/link';
import { notFoundMessages } from '@/presentation/messages/notFound';

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-4 py-12 sm:px-6 sm:py-16">
      <section className="max-w-2xl text-center" aria-labelledby="not-found-title">
        <h1
          id="not-found-title"
          className="text-7xl font-extrabold tracking-tight text-sky-700 sm:text-9xl"
        >
          {notFoundMessages.title}
        </h1>
        <p className="mt-4 text-lg font-semibold text-slate-900 sm:text-xl">
          {notFoundMessages.heading}
        </p>
        <p className="mt-2 text-slate-600">
          {notFoundMessages.description}
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-700"
          >
            {notFoundMessages.backHome}
          </Link>
        </div>
      </section>
    </div>
  );
}
