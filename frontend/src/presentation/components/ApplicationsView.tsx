'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { ApplicationsList } from './ApplicationsList';
import { LoginForm } from './LoginForm';
import { CookieTokenStorage } from '@/infrastructure/storage/CookieTokenStorage';
import { useAuthActions } from '@/presentation/hooks/useAuthActions';
import { authMessages } from '@/presentation/messages/auth';
import { setOnUnauthorized } from '@/infrastructure/api/HttpClient';
import { clearAllSuspenseQueries } from '@/presentation/hooks/useSuspenseQuery';

function parseRole(token: string | null): 'admin' | 'application' | 'client' | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const parsed = JSON.parse(decoded) as { role?: string; exp?: number };
    if (parsed.exp && parsed.exp * 1000 < Date.now()) return null;
    const { role } = parsed;
    if (role === 'admin' || role === 'application' || role === 'client') return role;
    return null;
  } catch {
    return null;
  }
}

function RoleHeader({
  role,
  onLogout,
}: {
  role: 'admin' | 'application' | 'client';
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
  const { logout } = useAuthActions();

  const storage = useMemo(() => new CookieTokenStorage(), []);
  const token = storage.getToken();
  const role = parseRole(token);

  const handleAuthChange = useCallback(() => forceRender((k) => k + 1), []);

  const handleLogout = useCallback(() => {
    logout();
    clearAllSuspenseQueries();
    handleAuthChange();
  }, [logout, handleAuthChange]);

  useEffect(() => {
    setOnUnauthorized(() => {
      logout();
      clearAllSuspenseQueries();
      handleAuthChange();
    });
    return () => setOnUnauthorized(() => {});
  }, [logout, handleAuthChange]);

  if (!token || !role) {
    return (
      <LoginForm
        onAdminLogin={handleAuthChange}
        onClientLogin={handleAuthChange}
      />
    );
  }

  return (
    <>
      <RoleHeader role={role} onLogout={handleLogout} />
      {(role === 'admin' || role === 'client') && <ApplicationsList role={role} />}
      {role === 'application' && (
        <LoginForm
          onAdminLogin={handleAuthChange}
          onClientLogin={handleAuthChange}
        />
      )}
    </>
  );
}
