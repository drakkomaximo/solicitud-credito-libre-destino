/// <reference types="bun-types" />

import { describe, it, expect } from 'bun:test';
import { GetApplicationEvents } from '@/application/useCases/GetApplicationEvents';
import type { ApplicationRepository } from '@/domain/repositories/ApplicationRepository';
import type { ApplicationEvent, CreditApplication } from '@/domain/entities/Application';

class FakeApplicationRepository implements ApplicationRepository {
  create = () => Promise.reject(new Error('not implemented'));
  getById = () => Promise.reject(new Error('not implemented'));
  getEvents = (id: string): Promise<ApplicationEvent[]> =>
    Promise.resolve([
      { id: 'evt-1', type: 'CREATED', occurredAt: '2026-01-01T00:00:00.000Z' },
      { id: 'evt-2', type: 'SIMULATED', payload: { result: 'approved' }, occurredAt: '2026-01-01T00:00:00.000Z' },
    ]);
  list = () => Promise.resolve({ data: [], nextCursor: null, hasNextPage: false, limit: 10 });
  lookup = () => Promise.reject(new Error('not implemented'));
  update = () => Promise.reject(new Error('not implemented'));
  simulateOffer = () => Promise.reject(new Error('not implemented'));
  finalize = () => Promise.reject(new Error('not implemented'));
  abandon = () => Promise.reject(new Error('not implemented'));
  decide = () => Promise.reject(new Error('not implemented'));
}

describe('GetApplicationEvents', () => {
  it('returns the event history', async () => {
    const useCase = new GetApplicationEvents(new FakeApplicationRepository());
    const result = await useCase.execute('app-1');
    expect(result.length).toBe(2);
    expect(result[0].type).toBe('CREATED');
    expect(result[1].type).toBe('SIMULATED');
  });
});
