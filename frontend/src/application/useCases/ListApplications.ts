import { ListApplicationsResult } from '@/domain/entities/Application';
import { ApplicationRepository } from '@/domain/repositories/ApplicationRepository';

export class ListApplications {
  constructor(private readonly repository: ApplicationRepository) {}

  async execute(filters?: {
    status?: string;
    channel?: string;
    q?: string;
    cursor?: string;
    limit?: number;
  }): Promise<ListApplicationsResult> {
    return this.repository.list(filters);
  }
}
