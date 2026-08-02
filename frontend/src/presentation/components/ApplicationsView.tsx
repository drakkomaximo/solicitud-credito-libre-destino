'use client';

import { useState, useMemo } from 'react';
import { ApplicationsList } from './ApplicationsList';
import { ClientDashboard } from './ClientDashboard';
import { LoginForm } from './LoginForm';
import { CookieTokenStorage } from '@/infrastructure/storage/CookieTokenStorage';
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

export function ApplicationsView() {
  const [, forceRender] = useState(0);
  const [clientApp, setClientApp] = useState<CreditApplication | null>(null);

  const storage = useMemo(() => new CookieTokenStorage(), []);
  const token = storage.getToken();
  const role = parseRole(token);

  const handleAuthChange = () => forceRender((k) => k + 1);

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

  if (role === 'admin') {
    return <ApplicationsList />;
  }

  if (clientApp) {
    return (
      <ClientDashboard
        app={clientApp}
        onLogout={() => {
          setClientApp(null);
          handleAuthChange();
        }}
      />
    );
  }

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
