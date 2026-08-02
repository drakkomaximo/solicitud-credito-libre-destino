'use client';

import { useState, useMemo } from 'react';
import { ApplicationsList } from './ApplicationsList';
import { ClientDashboard } from './ClientDashboard';
import { LoginForm } from './LoginForm';
import { CookieTokenStorage } from '@/infrastructure/storage/CookieTokenStorage';
import { useAuthActions } from '@/presentation/hooks/useAuthActions';
import { authMessages } from '@/presentation/messages/auth';
import type { CreditApplication } from '@/domain/entities/Application';

function parseRole(token: string | null): 'admin' | 'application' | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const { role } = JSON.parse(decoded) as { role?: string };
    if (role === 'admin' || role === 'application') return role;
    return null;
  } catch {
    return null;
  }
}

function RoleHeader({
  role,
  onLogout,
}: {
  role: 'admin' | 'application';
  onLogout: () => void;
}) {
  const label = role === 'admin' ? authMessages.admin : authMessages.client;
  return (
    <header className="mx-auto max-w-5xl p-4 mb-4 flex items-center justify-between bg-white shadow rounded">
      <span className="font-medium text-slate-700">
        {authMessages.loggedAs}: <strong>{label}</strong>
      </span>
      <button
        type="button"
        onClick={onLogout}
        className="rounded border px-3 py-1 text-sm hover:bg-slate-100"
      >
        {authMessages.logout}
      </button>
    </header>
  );
}

export function ApplicationsView() {
  const [, forceRender] = useState(0);
  const [clientApp, setClientApp] = useState<CreditApplication | null>(null);
  const { logout } = useAuthActions();

  const storage = useMemo(() => new CookieTokenStorage(), []);
  const token = storage.getToken();
  const role = parseRole(token);

  const handleAuthChange = () => forceRender((k) => k + 1);

  const handleLogout = () => {
    logout();
    setClientApp(null);
    handleAuthChange();
  };

  if (!token || !role) {
    return (
      <LoginForm
        onAdminLogin={handleAuthChange}
        onClientLookup={(app) => {
          setClientApp(app);
          handleAuthChange();
        }}
      />
    );
  }

  return (
    <>
      <RoleHeader role={role} onLogout={handleLogout} />
      {role === 'admin' && <ApplicationsList />}
      {role === 'application' && clientApp && <ClientDashboard app={clientApp} />}
      {role === 'application' && !clientApp && (
        <LoginForm
          onAdminLogin={handleAuthChange}
          onClientLookup={(app) => {
            setClientApp(app);
            handleAuthChange();
          }}
        />
      )}
    </>
  );
}
