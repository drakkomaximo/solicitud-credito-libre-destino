/// <reference types="bun-types" />

import { describe, it, expect } from 'bun:test';
import { ListApplications } from '@/application/useCases/ListApplications';
import type { ApplicationRepository } from '@/domain/repositories/ApplicationRepository';
import type { CreditApplication, ListApplicationsResult } from '@/domain/entities/Application';

class FakeApplicationRepository implements ApplicationRepository {
  create = () => Promise.reject(new Error('not implemented'));
  getById = () => Promise.reject(new Error('not implemented'));
  getEvents = () => Promise.resolve([]);
  list = (filters?: {
    status?: string;
    channel?: string;
    q?: string;
    cursor?: string;
    limit?: number;
  }): Promise<ListApplicationsResult> =>
    Promise.resolve({
      data: [
        {
          id: 'app-1',
          channel: filters?.channel ?? 'self-service',
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
          status: filters?.status ?? 'DRAFT',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          events: [],
        } as CreditApplication,
      ],
      nextCursor: null,
      hasNextPage: false,
      limit: filters?.limit ?? 10,
    });
  lookup = () => Promise.reject(new Error('not implemented'));
  update = () => Promise.reject(new Error('not implemented'));
  simulateOffer = () => Promise.reject(new Error('not implemented'));
  finalize = () => Promise.reject(new Error('not implemented'));
  abandon = () => Promise.reject(new Error('not implemented'));
  decide = () => Promise.reject(new Error('not implemented'));
}

describe('ListApplications', () => {
  it('returns paginated applications with filters', async () => {
    const useCase = new ListApplications(new FakeApplicationRepository());
    const result = await useCase.execute({ status: 'DRAFT', channel: 'self-service', q: 'Ana', cursor: 'c1', limit: 5 });
    expect(result.data.length).toBe(1);
    expect(result.data[0].status).toBe('DRAFT');
    expect(result.limit).toBe(5);
    expect(result.hasNextPage).toBe(false);
  });
});
