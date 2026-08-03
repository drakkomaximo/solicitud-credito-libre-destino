export const queryKeys = {
  references: () => ['references'] as const,
  applications: {
    all: () => ['applications'] as const,
    list: (filters: { role: string; status: string; channel: string; q: string }) =>
      ['applications', 'list', filters] as const,
    detail: (id: string) => ['applications', 'detail', id] as const,
    edit: (id: string) => ['applications', 'edit', id] as const,
    events: (id: string) => ['applications', 'events', id] as const,
  },
} as const;
