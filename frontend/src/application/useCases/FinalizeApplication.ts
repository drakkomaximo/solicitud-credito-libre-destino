import { CreditApplication } from '@/domain/entities/Application';
import { ApplicationRepository } from '@/domain/repositories/ApplicationRepository';

export class FinalizeApplication {
  constructor(private readonly repository: ApplicationRepository) {}

  async execute(id: string): Promise<CreditApplication> {
    return this.repository.finalize(id);
  }
}
