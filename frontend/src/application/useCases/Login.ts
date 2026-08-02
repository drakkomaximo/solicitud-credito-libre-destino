import { AuthApiRepository } from '@/infrastructure/repositories/AuthApiRepository';

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
}

export class Login {
  constructor(private readonly repository: AuthApiRepository) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    return this.repository.login(input);
  }
}
