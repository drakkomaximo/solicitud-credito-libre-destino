/// <reference types="bun-types" />

import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';

const API_BASE = 'http://test-api';
process.env.NEXT_PUBLIC_API_URL = API_BASE;

import { httpClient } from '@/infrastructure/api/HttpClient';
import { ApiError } from '@/domain/errors/ApiError';

describe('HttpClient', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = mock(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve({ data: { id: '1' } }),
      } as Response),
    ) as unknown as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('returns parsed data from a successful envelope response', async () => {
    const result = await httpClient<{ id: string }>('/applications');
    expect(result).toEqual({ id: '1' });
    expect(globalThis.fetch).toHaveBeenCalled();
  });

  it('sends JSON body and content-type for POST', async () => {
    await httpClient('/applications', {
      method: 'POST',
      body: JSON.stringify({ name: 'test' }),
    });

    const fetchMock = globalThis.fetch as unknown as {
      mock: { calls: Array<[string, { method?: string; body?: string; headers: Record<string, string> }]> };
    };
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API_BASE}/api/v1/applications`);
    expect(options.method).toBe('POST');
    expect(options.body).toBe(JSON.stringify({ name: 'test' }));
    expect(options.headers['Content-Type']).toBe('application/json');
  });

  it('throws ApiError on non-ok response with backend message', async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ message: 'Invalid input' }),
      } as Response),
    ) as unknown as typeof fetch;

    await expect(httpClient('/applications')).rejects.toThrow(ApiError);
    await expect(httpClient('/applications')).rejects.toThrow('Invalid input');
  });
});
