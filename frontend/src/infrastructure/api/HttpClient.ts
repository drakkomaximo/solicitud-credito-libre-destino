import { ApiError } from '@/domain/errors/ApiError';

type UnauthorizedCallback = () => void;
let onUnauthorized: UnauthorizedCallback | null = null;

export function setOnUnauthorized(callback: UnauthorizedCallback): void {
  onUnauthorized = callback;
}

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

function generateRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
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
  const requestId = generateRequestId();
  const res = await fetch(url, {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-request-id': requestId,
      ...(rest.headers || {}),
    },
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    const details =
      payload?.errors?.map((e: { message: string }) => e.message).join(', ') ||
      payload?.message ||
      res.statusText;
    const responseRequestId = res.headers?.get?.('x-request-id') || requestId;
    if (res.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    throw new ApiError(res.status, details, responseRequestId);
  }

  if (raw) {
    return payload as ApiResponse<T>;
  }

  if (payload && 'data' in payload) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
}
