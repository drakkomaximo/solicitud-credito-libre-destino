export interface ApplicationEvent {
  id: string;
  type: string;
  payload?: any;
  occurredAt: string;
}

export interface CreditApplication {
  id: string;
  channel: string;
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
  status: string;
  createdAt: string;
  updatedAt: string;
  events: ApplicationEvent[];
}
