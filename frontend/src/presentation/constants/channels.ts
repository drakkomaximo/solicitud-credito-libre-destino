export const CHANNEL_SELF_SERVICE = 'self-service' as const;
export const CHANNEL_ADVISOR = 'advisor' as const;

export const CHANNELS = [CHANNEL_SELF_SERVICE, CHANNEL_ADVISOR] as const;

export const CHANNEL_LABELS: Record<string, string> = {
  [CHANNEL_SELF_SERVICE]: 'Autogestionado',
  [CHANNEL_ADVISOR]: 'Asistido',
};
