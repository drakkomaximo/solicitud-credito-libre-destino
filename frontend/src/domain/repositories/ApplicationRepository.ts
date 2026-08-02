import { ApplicationEvent, CreditApplication, CreateApplicationInput, ListApplicationsResult } from '../entities/Application';

export interface ApplicationRepository {
  create(input: CreateApplicationInput): Promise<CreditApplication>;
  getById(id: string): Promise<CreditApplication>;
  getEvents(id: string): Promise<ApplicationEvent[]>;
  list(filters?: { status?: string; channel?: string; q?: string; cursor?: string; limit?: number }): Promise<ListApplicationsResult>;
  lookup(input: { documentNumber: string; phone: string }): Promise<CreditApplication>;
  update(id: string, input: Partial<CreateApplicationInput>): Promise<CreditApplication>;
  simulateOffer(id: string): Promise<CreditApplication>;
  finalize(id: string): Promise<CreditApplication>;
  abandon(id: string, reason: string): Promise<CreditApplication>;
}
