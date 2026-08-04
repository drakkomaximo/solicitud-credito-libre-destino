/// <reference types="bun-types" />

import { describe, it, expect } from 'bun:test';
import { editApplicationSchema } from '@/presentation/validation/editApplicationSchema';

const base = {
  income: 5000000,
  expenses: 2000000,
  amount: 3000000,
  term: 12,
  purpose: 'Viaje',
  dataAuthorized: true,
};

describe('editApplicationSchema', () => {
  it('accepts valid edit data', () => {
    const result = editApplicationSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it('rejects negative numbers', () => {
    const result = editApplicationSchema.safeParse({
      ...base,
      amount: -1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects a term lower than 1', () => {
    const result = editApplicationSchema.safeParse({
      ...base,
      term: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing authorization', () => {
    const result = editApplicationSchema.safeParse({
      ...base,
      dataAuthorized: false,
    });
    expect(result.success).toBe(false);
  });
});
