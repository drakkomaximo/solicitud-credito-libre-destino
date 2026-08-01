export interface CreateApplicationCommand {
  channel: string;
  advisorId?: string;
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
}
