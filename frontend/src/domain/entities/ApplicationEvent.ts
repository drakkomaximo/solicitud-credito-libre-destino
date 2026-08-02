export interface ApplicationEvent {
  id: string;
  type: string;
  payload?: unknown;
  occurredAt: string;
}
