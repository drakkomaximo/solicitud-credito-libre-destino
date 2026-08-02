import { z } from 'zod';
import { CHANNELS } from '@/presentation/constants/channels';
import { applicationFormErrors } from '@/presentation/messages/applicationForm';

export const newApplicationSchema = z.object({
  channel: z.enum(CHANNELS),
  advisorId: z.string().optional(),
  documentType: z.string().min(1, applicationFormErrors.required),
  documentNumber: z.string().min(1, applicationFormErrors.required),
  firstName: z.string().min(1, applicationFormErrors.required),
  lastName: z.string().min(1, applicationFormErrors.required),
  phone: z.string().min(1, applicationFormErrors.required),
  email: z.string().email(applicationFormErrors.invalidEmail),
  city: z.string().min(1, applicationFormErrors.required),
  income: z.coerce.number().min(0, applicationFormErrors.positiveNumber),
  expenses: z.coerce.number().min(0, applicationFormErrors.positiveNumber),
  amount: z.coerce.number().min(0, applicationFormErrors.positiveNumber),
  term: z.coerce.number().int().min(1, applicationFormErrors.minTerm),
  purpose: z.string().min(1, applicationFormErrors.required),
  dataAuthorized: z.boolean(),
});

export type NewApplicationFormData = z.infer<typeof newApplicationSchema>;
