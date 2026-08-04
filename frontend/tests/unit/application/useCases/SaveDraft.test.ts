/// <reference types="bun-types" />

import { describe, it, expect } from 'bun:test';
import { SaveDraft } from '@/application/useCases/SaveDraft';
import type { ApplicationRepository } from '@/domain/repositories/ApplicationRepository';
import type { CreditApplication, CreateApplicationInput } from '@/domain/entities/Application';

class FakeApplicationRepository implements ApplicationRepository {
  create = () => Promise.reject(new Error('not implemented'));
  getById = () => Promise.reject(new Error('not implemented'));
  getEvents = () => Promise.resolve([]);
  list = () => Promise.resolve({ data: [], nextCursor: null, hasNextPage: false, limit: 10 });
  lookup = () => Promise.reject(new Error('not implemented'));
  update = (id: string, input: Partial<CreateApplicationInput>): Promise<CreditApplication> =>
    Promise.resolve({
      id,
      channel: input.channel ?? 'self-service',
      documentType: input.documentType ?? 'CC',
      documentNumber: input.documentNumber ?? '123456',
      firstName: input.firstName ?? 'Ana',
      lastName: input.lastName ?? 'Pérez',
      phone: input.phone ?? '3001234567',
      email: input.email ?? 'ana@example.com',
      city: input.city ?? 'Bogotá',
      income: input.income ?? 1000,
      expenses: input.expenses ?? 500,
      amount: input.amount ?? 2000,
      term: input.term ?? 12,
      purpose: input.purpose ?? 'Viaje',
      dataAuthorized: input.dataAuthorized ?? true,
      status: 'DRAFT',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      events: [],
    });
  simulateOffer = () => Promise.reject(new Error('not implemented'));
  finalize = () => Promise.reject(new Error('not implemented'));
  abandon = () => Promise.reject(new Error('not implemented'));
  decide = () => Promise.reject(new Error('not implemented'));
}

describe('SaveDraft', () => {
  it('updates the draft with partial data', async () => {
    const useCase = new SaveDraft(new FakeApplicationRepository());
    const result = await useCase.execute('app-1', { amount: 3500000, term: 24 });
    expect(result.id).toBe('app-1');
    expect(result.amount).toBe(3500000);
    expect(result.term).toBe(24);
  });
});
