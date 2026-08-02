import { ApiError } from '@/domain/errors/ApiError';

declare const process: { env: Record<string, string | undefined> };

const getApiBase = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    limit: number;
    nextCursor: string | null;
    hasNextPage: boolean;
  };
  errors?: Array<{ message: string }>;
}

export async function httpClient<T>(
  path: string,
  options?: RequestInit & { raw?: false },
): Promise<T>;
export async function httpClient<T>(
  path: string,
  options: RequestInit & { raw: true },
): Promise<ApiResponse<T>>;
export async function httpClient<T>(
  path: string,
  options: RequestInit & { raw?: boolean } = {},
): Promise<T | ApiResponse<T>> {
  const { raw, ...rest } = options;
  const url = `${getApiBase()}/api/v1${path}`;
  const res = await fetch(url, {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(rest.headers || {}),
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

  if (raw) {
    return payload as ApiResponse<T>;
  }

  if (payload && 'data' in payload) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
}
