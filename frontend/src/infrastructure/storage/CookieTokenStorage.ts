import { TokenStorage } from '@/domain/repositories/TokenStorage';

const KEY = 'credit_token';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

function setCookie(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax; ${secure}`.trim();
}

function removeCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export class CookieTokenStorage implements TokenStorage {
  getToken(): string | null {
    return getCookie(KEY);
  }

  saveToken(token: string): void {
    setCookie(KEY, token);
  }

  clearToken(): void {
    removeCookie(KEY);
  }
}
