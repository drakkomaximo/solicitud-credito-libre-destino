/// <reference types="bun-types" />

import { describe, it, expect } from 'bun:test';
import { CreateApplication } from '@/application/useCases/CreateApplication';
import type { ApplicationRepository } from '@/domain/repositories/ApplicationRepository';
import type { CreditApplication, CreateApplicationInput } from '@/domain/entities/Application';

class FakeApplicationRepository implements ApplicationRepository {
  create = (input: CreateApplicationInput): Promise<CreditApplication> =>
    Promise.resolve({
      ...input,
      id: 'app-1',
      status: 'DRAFT',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      events: [],
    } as CreditApplication);

  getById = () => Promise.reject(new Error('not implemented'));
  getEvents = () => Promise.resolve([]);
  list = () => Promise.resolve([]);
  update = () => Promise.reject(new Error('not implemented'));
  simulateOffer = () => Promise.reject(new Error('not implemented'));
  finalize = () => Promise.reject(new Error('not implemented'));
  abandon = () => Promise.reject(new Error('not implemented'));
}

describe('CreateApplication', () => {
  it('creates a credit application through the repository', async () => {
    const repository = new FakeApplicationRepository();
    const useCase = new CreateApplication(repository);

    const input: CreateApplicationInput = {
      channel: 'self-service',
      documentType: 'CC',
      documentNumber: '123456',
      firstName: 'Ana',
      lastName: 'Pérez',
      phone: '300',
      email: 'ana@example.com',
      city: 'Bogotá',
      income: 1000,
      expenses: 500,
      amount: 2000,
      term: 12,
      purpose: 'Viaje',
      dataAuthorized: true,
    };

    const result = await useCase.execute(input);

    expect(result.id).toBe('app-1');
    expect(result.status).toBe('DRAFT');
    expect(result.firstName).toBe('Ana');
  });
});
