import { CreditApplication } from '@/domain/entities/Application';
import { ApplicationRepository } from '@/domain/repositories/ApplicationRepository';

export interface LookupApplicationInput {
  documentNumber: string;
  phone: string;
}

export class LookupApplication {
  constructor(private readonly repository: ApplicationRepository) {}

  async execute(input: LookupApplicationInput): Promise<CreditApplication> {
    return this.repository.lookup(input);
  }
}
