import { CreditApplication, CreateApplicationInput } from '@/domain/entities/Application';
import { ApplicationRepository } from '@/domain/repositories/ApplicationRepository';

export class SaveDraft {
  constructor(private readonly repository: ApplicationRepository) {}

  async execute(
    id: string,
    input: Partial<CreateApplicationInput>,
  ): Promise<CreditApplication> {
    return this.repository.update(id, input);
  }
}
