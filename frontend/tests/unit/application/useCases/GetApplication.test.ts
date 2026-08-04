/// <reference types="bun-types" />

import { describe, it, expect } from 'bun:test';
import { GetApplication } from '@/application/useCases/GetApplication';
import type { ApplicationRepository } from '@/domain/repositories/ApplicationRepository';
import type { CreditApplication, CreateApplicationInput } from '@/domain/entities/Application';

class FakeApplicationRepository implements ApplicationRepository {
  create = () => Promise.reject(new Error('not implemented'));
  getById = (id: string): Promise<CreditApplication> =>
    Promise.resolve({
      id,
      channel: 'self-service',
      documentType: 'CC',
      documentNumber: '123456',
      firstName: 'Ana',
      lastName: 'Pérez',
      phone: '3001234567',
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
  getEvents = () => Promise.resolve([]);
  list = () => Promise.resolve({ data: [], nextCursor: null, hasNextPage: false, limit: 10 });
  lookup = () => Promise.reject(new Error('not implemented'));
  update = () => Promise.reject(new Error('not implemented'));
  simulateOffer = () => Promise.reject(new Error('not implemented'));
  finalize = () => Promise.reject(new Error('not implemented'));
  abandon = () => Promise.reject(new Error('not implemented'));
  decide = () => Promise.reject(new Error('not implemented'));
}

describe('GetApplication', () => {
  it('returns the application by id', async () => {
    const useCase = new GetApplication(new FakeApplicationRepository());
    const result = await useCase.execute('app-1');
    expect(result.id).toBe('app-1');
    expect(result.firstName).toBe('Ana');
  });
});
