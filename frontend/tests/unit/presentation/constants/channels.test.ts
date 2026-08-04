/// <reference types="bun-types" />

import { describe, it, expect } from 'bun:test';
import { CHANNELS, CHANNEL_LABELS, CHANNEL_SELF_SERVICE, CHANNEL_ADVISOR } from '@/presentation/constants/channels';

describe('channels constants', () => {
  it('exposes both channels', () => {
    expect(CHANNELS).toContain(CHANNEL_SELF_SERVICE);
    expect(CHANNELS).toContain(CHANNEL_ADVISOR);
    expect(CHANNELS.length).toBe(2);
  });

  it('has labels for both channels', () => {
    expect(CHANNEL_LABELS[CHANNEL_SELF_SERVICE]).toBe('Autogestionado');
    expect(CHANNEL_LABELS[CHANNEL_ADVISOR]).toBe('Asistido');
  });
});
