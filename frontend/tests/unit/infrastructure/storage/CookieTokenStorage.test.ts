/// <reference types="bun-types" />

import { describe, it, expect, beforeEach } from 'bun:test';
import { CookieTokenStorage } from '@/infrastructure/storage/CookieTokenStorage';

describe('CookieTokenStorage', () => {
  beforeEach(() => {
    (globalThis as any).document = { cookie: '' };
    (globalThis as any).window = { location: { protocol: 'https:' } };
  });

  it('returns null when no token is stored', () => {
    const storage = new CookieTokenStorage();
    expect(storage.getToken()).toBeNull();
  });

  it('saves and retrieves a token', () => {
    const storage = new CookieTokenStorage();
    storage.saveToken('my-token');
    expect(storage.getToken()).toBe('my-token');
  });

  it('clears the token', () => {
    const storage = new CookieTokenStorage();
    storage.saveToken('my-token');
    storage.clearToken();
    expect(storage.getToken()).toBeNull();
  });

  it('does not break when document is undefined', () => {
    delete (globalThis as any).document;
    delete (globalThis as any).window;
    const storage = new CookieTokenStorage();
    expect(storage.getToken()).toBeNull();
    expect(() => storage.saveToken('x')).not.toThrow();
    expect(() => storage.clearToken()).not.toThrow();
  });
});
