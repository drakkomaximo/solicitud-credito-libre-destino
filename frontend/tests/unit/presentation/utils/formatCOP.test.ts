/// <reference types="bun-types" />

import { describe, it, expect } from 'bun:test';
import { formatCOP } from '@/presentation/utils/formatCOP';

describe('formatCOP', () => {
  it('formats a number as Colombian pesos without decimals', () => {
    const formatted = formatCOP(1500000);
    expect(formatted).toMatch('$');
    expect(formatted).toMatch('1.500.000');
  });

  it('returns $0 for zero', () => {
    const formatted = formatCOP(0);
    expect(formatted).toMatch('$');
    expect(formatted).toMatch('0');
  });
});
