import { ReferenceMap } from '../entities/Reference';

export interface ReferenceRepository {
  getAll(): Promise<ReferenceMap>;
  getByDomain(domain: string): Promise<string[]>;
}
