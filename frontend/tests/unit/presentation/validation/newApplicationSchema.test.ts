/// <reference types="bun-types" />

import { describe, it, expect } from 'bun:test';
import { newApplicationSchema } from '@/presentation/validation/newApplicationSchema';
import { CHANNEL_ADVISOR, CHANNEL_SELF_SERVICE } from '@/presentation/constants/channels';

const base = {
  channel: CHANNEL_SELF_SERVICE,
  documentType: 'CC',
  documentNumber: '1234567890',
  firstName: 'Juan',
  lastName: 'Pérez',
  phone: '3001234567',
  email: 'juan@example.com',
  city: 'Bogotá',
  income: 5000000,
  expenses: 2000000,
  amount: 3000000,
  term: 12,
  purpose: 'Viaje',
  dataAuthorized: true,
};

describe('newApplicationSchema', () => {
  it('accepts a valid self-service application', () => {
    const result = newApplicationSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it('accepts a valid advisor application with advisorId', () => {
    const result = newApplicationSchema.safeParse({
      ...base,
      channel: CHANNEL_ADVISOR,
      advisorId: 'ADV-001',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an advisor application without advisorId', () => {
    const result = newApplicationSchema.safeParse({
      ...base,
      channel: CHANNEL_ADVISOR,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path);
      expect(paths.some((path) => path.includes('advisorId'))).toBe(true);
    }
  });

  it('rejects an invalid email', () => {
    const result = newApplicationSchema.safeParse({
      ...base,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('requires dataAuthorized to be true', () => {
    const result = newApplicationSchema.safeParse({
      ...base,
      dataAuthorized: false,
    });
    expect(result.success).toBe(false);
  });
});
