export const ApplicationStatus = {
  DRAFT: 'DRAFT',
  NOT_VIABLE: 'NOT_VIABLE',
  PENDING_VALIDATION: 'PENDING_VALIDATION',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ABANDONED: 'ABANDONED',
} as const;

export type ApplicationStatusValue = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export const ApplicationChannel = {
  SELF_SERVICE: 'self-service',
  ADVISOR: 'advisor',
} as const;

export type ApplicationChannelValue = (typeof ApplicationChannel)[keyof typeof ApplicationChannel];

export const DocumentType = {
  CC: 'CC',
  CE: 'CE',
  PA: 'PA',
} as const;

export type DocumentTypeValue = (typeof DocumentType)[keyof typeof DocumentType];
