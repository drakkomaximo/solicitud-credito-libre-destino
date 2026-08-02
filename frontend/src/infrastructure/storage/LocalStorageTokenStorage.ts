import { TokenStorage } from '@/domain/repositories/TokenStorage';

const KEY = 'credit_application_token';

export class LocalStorageTokenStorage implements TokenStorage {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(KEY);
  }

  saveToken(token: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(KEY, token);
  }

  clearToken(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(KEY);
  }
}
