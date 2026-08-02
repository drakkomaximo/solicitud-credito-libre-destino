import { TokenStorage } from '@/domain/repositories/TokenStorage';
import { httpClient } from '../api/HttpClient';

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
}

export class AuthApiRepository {
  constructor(private readonly tokenStorage: TokenStorage) {}

  async login(input: LoginInput): Promise<LoginResult> {
    const result = await httpClient<LoginResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    if (result.accessToken) {
      this.tokenStorage.saveToken(result.accessToken);
    }
    return result;
  }
}
