'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ApplicationsList } from '@/presentation/components/applications/list/ApplicationsList';
import { LoginForm } from '@/presentation/components/auth/LoginForm';
import { RoleHeader } from '@/presentation/components/auth/RoleHeader';
import { parseRole } from '@/presentation/utils/parseRole';
import { CookieTokenStorage } from '@/infrastructure/storage/CookieTokenStorage';
import { useAuthActions } from '@/presentation/hooks/useAuthActions';
import { setOnUnauthorized } from '@/infrastructure/api/HttpClient';
import { useQueryClient } from '@tanstack/react-query';

export function ApplicationsView() {
  const router = useRouter();
  const pathname = usePathname();
  const [, forceRender] = useState(0);
  const queryClient = useQueryClient();
  const { logout } = useAuthActions();

  const storage = useMemo(() => new CookieTokenStorage(), []);
  const token = storage.getToken();
  const role = parseRole(token);

  const handleAuthChange = useCallback(() => forceRender((k) => k + 1), []);

  useEffect(() => {
    router.replace(pathname);
  }, [token, pathname, router]);

  const handleLogout = useCallback(() => {
    logout();
    queryClient.clear();
    handleAuthChange();
  }, [logout, handleAuthChange, queryClient]);

  useEffect(() => {
    setOnUnauthorized(() => {
      logout();
      queryClient.clear();
      handleAuthChange();
    });
    return () => setOnUnauthorized(() => {});
  }, [logout, handleAuthChange, queryClient]);

  if (!token || !role) {
    return (
      <LoginForm
        onAdminLogin={handleAuthChange}
        onClientLogin={handleAuthChange}
      />
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">
      {role !== 'application' && <RoleHeader role={role} onLogout={handleLogout} />}
      {role === 'application' ? (
        <LoginForm
          onAdminLogin={handleAuthChange}
          onClientLogin={handleAuthChange}
        />
      ) : (
        <ApplicationsList role={role} />
      )}
    </main>
  );
}
