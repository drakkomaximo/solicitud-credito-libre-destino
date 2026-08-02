'use client';

import Link from 'next/link';
import { useAuthActions } from '@/presentation/hooks/useAuthActions';
import { authMessages } from '@/presentation/messages/auth';
import { detailMessages } from '@/presentation/messages/detail';
import { summaryLabels } from '@/presentation/messages/applicationForm';
import type { CreditApplication } from '@/domain/entities/Application';

interface ClientDashboardProps {
  app: CreditApplication;
  onLogout: () => void;
}

export function ClientDashboard({ app, onLogout }: ClientDashboardProps) {
  const { logout } = useAuthActions();

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{authMessages.clientWelcome}</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded border px-4 py-2"
        >
          {authMessages.logout}
        </button>
      </div>
      <div className="mt-4 space-y-2">
        <p>
          <strong>{detailMessages.document}:</strong> {app.documentType} {app.documentNumber}
        </p>
        <p>
          <strong>{detailMessages.status}:</strong> {app.status}
        </p>
        <p>
          <strong>{summaryLabels.name}:</strong> {app.firstName} {app.lastName}
        </p>
        {app.amount > 0 && (
          <p>
            <strong>{detailMessages.amount}:</strong> ${app.amount}
          </p>
        )}
      </div>
      <Link
        href={`/applications/${app.id}`}
        className="mt-4 inline-block rounded bg-sky-600 px-4 py-2 text-white"
      >
        {detailMessages.requestTitle} {app.firstName}
      </Link>
    </main>
  );
}
