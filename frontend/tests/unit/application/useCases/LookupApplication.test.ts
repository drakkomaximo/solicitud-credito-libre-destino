/// <reference types="bun-types" />

import { describe, it, expect } from 'bun:test';
import { LookupApplication } from '@/application/useCases/LookupApplication';
import type { ApplicationRepository } from '@/domain/repositories/ApplicationRepository';
import type { CreditApplication } from '@/domain/entities/Application';

class FakeApplicationRepository implements ApplicationRepository {
  create = () => Promise.reject(new Error('not implemented'));
  getById = () => Promise.reject(new Error('not implemented'));
  getEvents = () => Promise.resolve([]);
  list = () => Promise.resolve({ data: [], nextCursor: null, hasNextPage: false, limit: 10 });
  lookup = (input: { documentNumber: string; phone: string }): Promise<CreditApplication> =>
    Promise.resolve({
      id: 'app-1',
      channel: 'self-service',
      documentType: 'CC',
      documentNumber: input.documentNumber,
      firstName: 'Ana',
      lastName: 'Pérez',
      phone: input.phone,
      email: 'ana@example.com',
      city: 'Bogotá',
      income: 1000,
      expenses: 500,
      amount: 2000,
      term: 12,
      purpose: 'Viaje',
      dataAuthorized: true,
      status: 'DRAFT',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      events: [],
    });
  update = () => Promise.reject(new Error('not implemented'));
  simulateOffer = () => Promise.reject(new Error('not implemented'));
  finalize = () => Promise.reject(new Error('not implemented'));
  abandon = () => Promise.reject(new Error('not implemented'));
  decide = () => Promise.reject(new Error('not implemented'));
}

describe('LookupApplication', () => {
  it('finds a draft by document and phone', async () => {
    const useCase = new LookupApplication(new FakeApplicationRepository());
    const result = await useCase.execute({ documentNumber: '123456', phone: '3001234567' });
    expect(result.id).toBe('app-1');
    expect(result.documentNumber).toBe('123456');
    expect(result.phone).toBe('3001234567');
  });
});
