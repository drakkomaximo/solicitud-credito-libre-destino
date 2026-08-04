/// <reference types="bun-types" />

import { describe, it, expect } from 'bun:test';
import { normalizePhone } from '@/presentation/utils/normalizePhone';

describe('normalizePhone', () => {
  it('removes non-numeric characters', () => {
    expect(normalizePhone('300-123-4567')).toBe('3001234567');
    expect(normalizePhone('300 123 4567')).toBe('3001234567');
    expect(normalizePhone('(300) 123-4567')).toBe('3001234567');
  });

  it('removes the leading 57 country code', () => {
    expect(normalizePhone('573001234567')).toBe('3001234567');
    expect(normalizePhone('+57 300 123 4567')).toBe('3001234567');
  });

  it('leaves a 10-digit number unchanged', () => {
    expect(normalizePhone('3001234567')).toBe('3001234567');
  });

  it('returns an empty string for missing input', () => {
    expect(normalizePhone('')).toBe('');
  });
});
