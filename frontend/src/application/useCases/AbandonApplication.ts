import { CreditApplication } from '@/domain/entities/Application';
import { ApplicationRepository } from '@/domain/repositories/ApplicationRepository';

export class AbandonApplication {
  constructor(private readonly repository: ApplicationRepository) {}

  async execute(id: string, reason: string): Promise<CreditApplication> {
    return this.repository.abandon(id, reason);
  }
}
