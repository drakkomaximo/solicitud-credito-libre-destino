export interface TokenStorage {
  getToken(): string | null;
  saveToken(token: string): void;
  clearToken(): void;
}
