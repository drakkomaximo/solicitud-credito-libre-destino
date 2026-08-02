import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const TOKEN_COOKIE = 'credit_token';

function extractToken(request: { headers: { authorization?: string; cookie?: string } }): string | null {
  const auth = request.headers.authorization;
  if (auth?.startsWith('Bearer ')) {
    return auth.replace('Bearer ', '');
  }

  const cookie = request.headers.cookie;
  if (cookie) {
    const match = cookie
      .split(/;\s*/)
      .find((row) => row.startsWith(`${TOKEN_COOKIE}=`));
    if (match) {
      return match.split('=').slice(1).join('=');
    }
  }

  return null;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string; cookie?: string }; user?: any }>();

    const token = extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Token requerido');
    }

    try {
      const payload = this.jwtService.verify(token) as { sub: string; role: string };
      if (payload.role !== 'admin') {
        throw new UnauthorizedException('Se requieren permisos de administrador');
      }
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
