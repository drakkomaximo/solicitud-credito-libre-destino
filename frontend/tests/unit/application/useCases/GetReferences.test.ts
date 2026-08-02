/// <reference types="bun-types" />

import { describe, it, expect } from 'bun:test';
import { GetReferences } from '@/application/useCases/GetReferences';
import type { ReferenceRepository } from '@/domain/repositories/ReferenceRepository';
import type { ReferenceMap } from '@/domain/entities/Reference';

class FakeReferenceRepository implements ReferenceRepository {
  getAll = (): Promise<ReferenceMap> =>
    Promise.resolve({
      'document-type': ['CC', 'CE'],
      'credit-term': ['12', '24'],
    });
  getByDomain = (domain: string) =>
    this.getAll().then((all) => all[domain] ?? []);
}

describe('GetReferences', () => {
  it('returns all reference catalogs', async () => {
    const useCase = new GetReferences(new FakeReferenceRepository());
    const result = await useCase.execute();

    expect(result['document-type']).toEqual(['CC', 'CE']);
    expect(result['credit-term']).toEqual(['12', '24']);
  });
});
