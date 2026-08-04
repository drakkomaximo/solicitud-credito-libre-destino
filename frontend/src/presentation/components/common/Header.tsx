'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { layoutMessages } from '@/presentation/messages/layout';

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-sky-700 to-sky-600 shadow-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-extrabold text-white sm:text-lg"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-xs font-bold shadow-sm sm:h-8 sm:w-8 sm:text-sm">
            AVT
          </span>
          {layoutMessages.brand}
        </Link>

        <nav className="hidden items-center gap-2 sm:flex" aria-label="Navegación principal">
          <Link
            href="/applications/new"
            aria-current={pathname === '/applications/new' ? 'page' : undefined}
            className="rounded-lg px-3 py-2 text-sm font-medium text-sky-50 transition hover:bg-white/10"
          >
            {layoutMessages.newApplication}
          </Link>
          <Link
            href="/applications"
            aria-current={pathname === '/applications' ? 'page' : undefined}
            className="rounded-lg px-3 py-2 text-sm font-medium text-sky-50 transition hover:bg-white/10"
          >
            {layoutMessages.applications}
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-lg p-2 text-white hover:bg-white/10 sm:hidden"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <nav
        aria-hidden={!open}
        className={`fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col items-center justify-center gap-10 bg-gradient-to-b from-sky-700 to-sky-600 px-6 text-2xl font-semibold text-white transition-all duration-300 ease-out sm:hidden ${
          open
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-6 opacity-0 pointer-events-none'
        }`}
      >
        <Link
          href="/applications/new"
          onClick={() => setOpen(false)}
          className="rounded-xl px-6 py-3 transition hover:bg-white/10"
        >
          {layoutMessages.newApplication}
        </Link>
        <Link
          href="/applications"
          onClick={() => setOpen(false)}
          className="rounded-xl px-6 py-3 transition hover:bg-white/10"
        >
          {layoutMessages.applications}
        </Link>
      </nav>
    </header>
  );
}