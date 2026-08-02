export const ApplicationStatus = {
  DRAFT: 'DRAFT',
  NOT_VIABLE: 'NOT_VIABLE',
  PENDING_VALIDATION: 'PENDING_VALIDATION',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ABANDONED: 'ABANDONED',
} as const;

export type ApplicationStatusValue =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export const ApplicationChannel = {
  SELF_SERVICE: 'self-service',
  ADVISOR: 'advisor',
} as const;

export type ApplicationChannelValue =
  (typeof ApplicationChannel)[keyof typeof ApplicationChannel];

export const DocumentType = {
  CC: 'CC',
  CE: 'CE',
  PA: 'PA',
} as const;

export type DocumentTypeValue =
  (typeof DocumentType)[keyof typeof DocumentType];

export const CreditTerm = {
  12: '12',
  24: '24',
  36: '36',
  48: '48',
  60: '60',
  72: '72',
} as const;

export type CreditTermValue = (typeof CreditTerm)[keyof typeof CreditTerm];
