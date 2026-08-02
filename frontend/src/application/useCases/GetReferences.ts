import { ReferenceMap } from '@/domain/entities/Reference';
import { ReferenceRepository } from '@/domain/repositories/ReferenceRepository';

export class GetReferences {
  constructor(private readonly repository: ReferenceRepository) {}

  async execute(): Promise<ReferenceMap> {
    return this.repository.getAll();
  }
}
