export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly details?: string,
  ) {
    super(`API error ${status}${details ? `: ${details}` : ''}`);
    this.name = 'ApiError';
  }
}
