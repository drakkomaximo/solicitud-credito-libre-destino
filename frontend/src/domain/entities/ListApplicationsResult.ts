import type { CreditApplication } from './CreditApplication';

export interface ListApplicationsResult {
  data: CreditApplication[];
  nextCursor: string | null;
  hasNextPage: boolean;
  limit: number;
}
