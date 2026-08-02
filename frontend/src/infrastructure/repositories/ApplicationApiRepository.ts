import { ApplicationEvent, CreditApplication, CreateApplicationInput, ListApplicationsResult } from '@/domain/entities/Application';
import { ApplicationRepository } from '@/domain/repositories/ApplicationRepository';
import { TokenStorage } from '@/domain/repositories/TokenStorage';
import { httpClient } from '../api/HttpClient';

export class ApplicationApiRepository implements ApplicationRepository {
  constructor(private readonly tokenStorage: TokenStorage) {}

  private authHeaders(): Record<string, string> {
    const token = this.tokenStorage.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async create(input: CreateApplicationInput): Promise<CreditApplication> {
    const created = await httpClient<CreditApplication>('/applications', {
      method: 'POST',
      body: JSON.stringify(input),
      headers: this.authHeaders(),
    });
    if (created.accessToken) {
      this.tokenStorage.saveToken(created.accessToken);
    }
    return created;
  }

  async getById(id: string): Promise<CreditApplication> {
    return httpClient<CreditApplication>(`/applications/${id}`, {
      headers: this.authHeaders(),
    });
  }

  async getEvents(id: string): Promise<ApplicationEvent[]> {
    return httpClient<ApplicationEvent[]>(`/applications/${id}/events`, {
      headers: this.authHeaders(),
    });
  }

  async list(filters?: {
    status?: string;
    channel?: string;
    q?: string;
    cursor?: string;
    limit?: number;
  }): Promise<ListApplicationsResult> {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.channel) params.set('channel', filters.channel);
    if (filters?.q) params.set('q', filters.q);
    if (filters?.cursor) params.set('cursor', filters.cursor);
    if (filters?.limit) params.set('limit', String(filters.limit));
    const query = params.toString();
    return httpClient<ListApplicationsResult>(
      `/applications${query ? `?${query}` : ''}`,
      {
        headers: this.authHeaders(),
      },
    );
  }

  async lookup(input: {
    documentNumber: string;
    phone: string;
  }): Promise<CreditApplication> {
    const params = new URLSearchParams();
    params.set('documentNumber', input.documentNumber);
    params.set('phone', input.phone);
    const result = await httpClient<CreditApplication>(
      `/applications/lookup?${params.toString()}`,
      {
        headers: this.authHeaders(),
      },
    );
    if (result.accessToken) {
      this.tokenStorage.saveToken(result.accessToken);
    }
    return result;
  }

  async update(
    id: string,
    input: Partial<CreateApplicationInput>,
  ): Promise<CreditApplication> {
    return httpClient<CreditApplication>(`/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
      headers: this.authHeaders(),
    });
  }

  async simulateOffer(id: string): Promise<CreditApplication> {
    return httpClient<CreditApplication>(`/applications/${id}/simulate-offer`, {
      method: 'POST',
      headers: this.authHeaders(),
    });
  }

  async finalize(id: string): Promise<CreditApplication> {
    return httpClient<CreditApplication>(`/applications/${id}/finalize`, {
      method: 'POST',
      headers: this.authHeaders(),
    });
  }

  async abandon(id: string, reason: string): Promise<CreditApplication> {
    return httpClient<CreditApplication>(`/applications/${id}/abandon`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
      headers: this.authHeaders(),
    });
  }
}
