import { use } from 'react';

type SuspenseResult<T> =
  | { data: T; error: null }
  | { data: null; error: Error };

const promiseCache = new Map<string, Promise<SuspenseResult<unknown>>>();

export function invalidateSuspenseQuery(prefix: string): void {
  for (const key of promiseCache.keys()) {
    if (key.startsWith(prefix)) {
      promiseCache.delete(key);
    }
  }
}

export function clearAllSuspenseQueries(): void {
  promiseCache.clear();
}

export function useSuspenseQuery<T>(
  queryKey: string,
  fetcher: () => Promise<T>,
): SuspenseResult<T> {
  let promise = promiseCache.get(queryKey) as Promise<SuspenseResult<T>> | undefined;

  if (!promise) {
    promise = fetcher()
      .then((data) => ({ data, error: null }) as SuspenseResult<T>)
      .catch((error) => {
        const reason =
          error instanceof Error ? error : new Error(String(error));
        return { data: null, error: reason } as SuspenseResult<T>;
      });
    promiseCache.set(queryKey, promise as Promise<SuspenseResult<unknown>>);
  }

  return use(promise);
}
