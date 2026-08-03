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

export const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-700 border-slate-300',
  NOT_VIABLE: 'bg-orange-100 text-orange-800 border-orange-300',
  PENDING_VALIDATION: 'bg-amber-100 text-amber-800 border-amber-300',
  APPROVED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  REJECTED: 'bg-red-100 text-red-800 border-red-300',
  ABANDONED: 'bg-rose-100 text-rose-800 border-rose-300',
  FINALIZED: 'bg-blue-100 text-blue-800 border-blue-300',
} as const;

export const EVENT_LABELS: Record<string, string> = {
  CREATED: 'Solicitud creada',
  UPDATED: 'Información actualizada',
  SIMULATED: 'Simulación de oferta',
  FINALIZED: 'Enviada a validación',
  ABANDONED: 'Solicitud abandonada',
  DECIDED: 'Decisión registrada',
} as const;

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

export function statusStyle(status: string): string {
  return STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-700 border-slate-300';
}

export function eventLabel(type: string): string {
  return EVENT_LABELS[type] ?? type;
}
