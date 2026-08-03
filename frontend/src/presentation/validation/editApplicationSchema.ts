import { z } from 'zod';
import { applicationFormErrors } from '@/presentation/messages/applicationForm';

export const editApplicationSchema = z.object({
  income: z.coerce.number().min(0, applicationFormErrors.positiveNumber),
  expenses: z.coerce.number().min(0, applicationFormErrors.positiveNumber),
  amount: z.coerce.number().min(0, applicationFormErrors.positiveNumber),
  term: z.coerce.number().int().min(1, applicationFormErrors.minTerm),
  purpose: z.string().min(1, applicationFormErrors.required),
  dataAuthorized: z.boolean().refine((value) => value === true, {
    message: applicationFormErrors.required,
  }),
});

export type EditApplicationFormData = z.infer<typeof editApplicationSchema>;
