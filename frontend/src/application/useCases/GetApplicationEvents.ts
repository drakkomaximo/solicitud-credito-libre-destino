import { ApplicationEvent } from '@/domain/entities/Application';
import { ApplicationRepository } from '@/domain/repositories/ApplicationRepository';

export class GetApplicationEvents {
  constructor(private readonly repository: ApplicationRepository) {}

  async execute(id: string): Promise<ApplicationEvent[]> {
    return this.repository.getEvents(id);
  }
}
