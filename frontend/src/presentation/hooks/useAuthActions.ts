import { useMemo } from 'react';
import { Login } from '@/application/useCases/Login';
import { LookupApplication } from '@/application/useCases/LookupApplication';
import { AuthApiRepository } from '@/infrastructure/repositories/AuthApiRepository';
import { ApplicationApiRepository } from '@/infrastructure/repositories/ApplicationApiRepository';
import { CookieTokenStorage } from '@/infrastructure/storage/CookieTokenStorage';

export function useAuthActions() {
  return useMemo(() => {
    const tokenStorage = new CookieTokenStorage();
    const authRepository = new AuthApiRepository(tokenStorage);
    const appRepository = new ApplicationApiRepository(tokenStorage);
    return {
      login: new Login(authRepository),
      lookup: new LookupApplication(appRepository),
      logout: () => tokenStorage.clearToken(),
    };
  }, []);
}
