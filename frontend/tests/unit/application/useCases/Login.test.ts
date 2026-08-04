/// <reference types="bun-types" />

import { describe, it, expect } from 'bun:test';
import { Login } from '@/application/useCases/Login';
import type { LoginInput, LoginResult } from '@/infrastructure/repositories/AuthApiRepository';

class FakeAuthApiRepository {
  login = (input: LoginInput): Promise<LoginResult> =>
    Promise.resolve({ accessToken: `token-for-${input.username}` });

  clientLogin = () => Promise.resolve({ accessToken: 'client-token' });
}

describe('Login', () => {
  it('returns an access token for valid credentials', async () => {
    const useCase = new Login(new FakeAuthApiRepository() as any);
    const result = await useCase.execute({ username: 'admin', password: 'secret' });
    expect(result.accessToken).toBe('token-for-admin');
  });
});
