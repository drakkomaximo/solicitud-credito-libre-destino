import { ReferenceMap } from '@/domain/entities/Reference';
import { ReferenceRepository } from '@/domain/repositories/ReferenceRepository';
import { httpClient } from '../api/HttpClient';

export class ReferenceApiRepository implements ReferenceRepository {
  async getAll(): Promise<ReferenceMap> {
    return httpClient<ReferenceMap>('/applications/enums');
  }

  async getByDomain(domain: string): Promise<string[]> {
    const all = await this.getAll();
    return all[domain] ?? [];
  }
}
