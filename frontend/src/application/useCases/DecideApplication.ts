import { CreditApplication } from '@/domain/entities/Application';
import { ApplicationRepository } from '@/domain/repositories/ApplicationRepository';

export class DecideApplication {
  constructor(private readonly repository: ApplicationRepository) {}

  async execute(
    id: string,
    decision: 'APPROVED' | 'REJECTED',
    reason?: string,
  ): Promise<CreditApplication> {
    return this.repository.decide(id, decision, reason);
  }
}
