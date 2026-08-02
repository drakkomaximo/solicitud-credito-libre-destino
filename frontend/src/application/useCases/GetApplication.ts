import { CreditApplication } from '@/domain/entities/Application';
import { ApplicationRepository } from '@/domain/repositories/ApplicationRepository';

export class GetApplication {
  constructor(private readonly repository: ApplicationRepository) {}

  async execute(id: string): Promise<CreditApplication> {
    return this.repository.getById(id);
  }
}
