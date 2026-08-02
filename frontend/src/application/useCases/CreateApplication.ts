import { ApplicationRepository } from '@/domain/repositories/ApplicationRepository';
import { CreditApplication, CreateApplicationInput } from '@/domain/entities/Application';

export class CreateApplication {
  constructor(private readonly repository: ApplicationRepository) {}

  async execute(input: CreateApplicationInput): Promise<CreditApplication> {
    return this.repository.create(input);
  }
}
