export const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Borrador',
  NOT_VIABLE: 'No viable',
  PENDING_VALIDATION: 'Finalizada (pendiente validación)',
  FINALIZED: 'Finalizada',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
  ABANDONED: 'Abandonada',
} as const;

export const ALL_STATUSES_LABEL = 'Todos los estados';
