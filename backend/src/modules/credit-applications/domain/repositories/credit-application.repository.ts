import { CreditApplication } from '@/modules/credit-applications/domain/entities/credit-application';

export interface ApplicationListFilters {
  status?: string;
  channel?: string;
  q?: string;
}

export interface ApplicationListQuery extends ApplicationListFilters {
  cursor?: string;
  limit?: number;
}

export interface ICreditApplicationRepository {
  save(application: CreditApplication): Promise<void>;
  findById(id: string): Promise<CreditApplication | null>;
  findAll(query?: ApplicationListQuery): Promise<CreditApplication[]>;
  count(filters?: ApplicationListFilters): Promise<number>;
  update(application: CreditApplication): Promise<void>;
}
