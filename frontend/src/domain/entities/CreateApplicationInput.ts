export interface CreateApplicationInput {
  channel: 'self-service' | 'advisor';
  advisorId?: string;
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  income: number;
  expenses: number;
  amount: number;
  term: number;
  purpose: string;
  dataAuthorized: boolean;
}
