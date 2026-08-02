import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface LoginCommand {
  username: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
}

export interface ApplicationTokenResult {
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(command: LoginCommand): Promise<LoginResult> {
    const expectedUsername = this.config.get<string>('ADMIN_USERNAME', 'admin');
    const expectedPassword = this.config.get<string>('ADMIN_SECRET');

    if (
      command.username !== expectedUsername ||
      command.password !== expectedPassword
    ) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: expectedUsername, role: 'admin' };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  generateApplicationToken(applicationId: string): string {
    const payload = { sub: applicationId, role: 'application' };
    return this.jwtService.sign(payload);
  }

  generateClientToken(documentNumber: string, phone: string): string {
    const payload = {
      sub: documentNumber,
      role: 'client',
      documentNumber,
      phone,
    };
    return this.jwtService.sign(payload);
  }
}
