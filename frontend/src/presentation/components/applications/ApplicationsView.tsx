'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { ApplicationsList } from './ApplicationsList';
import { LoginForm } from '../auth/LoginForm';
import { RoleHeader } from '../auth/RoleHeader';
import { parseRole } from '@/presentation/utils/parseRole';
import { CookieTokenStorage } from '@/infrastructure/storage/CookieTokenStorage';
import { useAuthActions } from '@/presentation/hooks/useAuthActions';
import { setOnUnauthorized } from '@/infrastructure/api/HttpClient';
import { clearAllSuspenseQueries } from '@/presentation/hooks/useSuspenseQuery';

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
