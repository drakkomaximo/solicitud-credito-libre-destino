import { ApiError } from '@/domain/errors/ApiError';

declare const process: { env: Record<string, string | undefined> };

const getApiBase = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: unknown;
  errors?: Array<{ message: string }>;
}

export async function httpClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${getApiBase()}/api/v1${path}`;
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    const details =
      payload?.errors?.map((e: { message: string }) => e.message).join(', ') ||
      payload?.message ||
      res.statusText;
    throw new ApiError(res.status, details);
  }

  if (payload && 'data' in payload) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
}
