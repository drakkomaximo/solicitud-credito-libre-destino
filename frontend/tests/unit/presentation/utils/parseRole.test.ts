/// <reference types="bun-types" />

import { describe, it, expect } from 'bun:test';
import { parseRole } from '@/presentation/utils/parseRole';

function buildToken(payload: { role?: string; exp?: number }) {
  const header = 'header';
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${header}.${body}.signature`;
}

describe('parseRole', () => {
  it('returns null for an empty token', () => {
    expect(parseRole(null)).toBeNull();
    expect(parseRole('')).toBeNull();
  });

  it('extracts the admin role from a valid token', () => {
    const token = buildToken({ role: 'admin' });
    expect(parseRole(token)).toBe('admin');
  });

  it('extracts the client role from a valid token', () => {
    const token = buildToken({ role: 'client' });
    expect(parseRole(token)).toBe('client');
  });

  it('returns null for an expired token', () => {
    const token = buildToken({ role: 'admin', exp: Math.floor(Date.now() / 1000) - 1 });
    expect(parseRole(token)).toBeNull();
  });

  it('returns null for a malformed token', () => {
    expect(parseRole('not.a.token')).toBeNull();
  });
});
