import { randomUUID } from 'crypto';

export class ApplicationEvent {
  readonly id: string;
  readonly type: string;
  readonly payload?: any;
  readonly occurredAt: Date;

  constructor(props: { type: string; payload?: any }) {
    this.id = randomUUID();
    this.type = props.type;
    this.payload = props.payload;
    this.occurredAt = new Date();
  }
}

export interface CreditApplicationProps {
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
  createdAt: Date;
  updatedAt: Date;
  events?: ApplicationEvent[];
}

export class CreditApplication {
  readonly id: string;
  readonly channel: string;
  readonly advisorId?: string;
  readonly documentType: string;
  readonly documentNumber: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly email: string;
  readonly city: string;
  income: number;
  expenses: number;
  amount: number;
  term: number;
  purpose: string;
  dataAuthorized: boolean;
  status: string;
  readonly createdAt: Date;
  updatedAt: Date;
  private _events: ApplicationEvent[];

  constructor(props: CreditApplicationProps) {
    this.id = props.id;
    this.channel = props.channel;
    this.advisorId = props.advisorId;
    this.documentType = props.documentType;
    this.documentNumber = props.documentNumber;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.phone = props.phone;
    this.email = props.email;
    this.city = props.city;
    this.income = props.income;
    this.expenses = props.expenses;
    this.amount = props.amount;
    this.term = props.term;
    this.purpose = props.purpose;
    this.dataAuthorized = props.dataAuthorized;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this._events = props.events ?? [];
  }

  get events(): ApplicationEvent[] {
    return this._events;
  }

  recordEvent(type: string, payload?: any): void {
    this._events.push(new ApplicationEvent({ type, payload }));
  }
}
