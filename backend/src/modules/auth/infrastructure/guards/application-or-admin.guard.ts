import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ApplicationOrAdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string }; params: { id?: string }; user?: any }>();
    const header = request.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token requerido');
    }

    const token = header.replace('Bearer ', '');

    try {
      const payload = this.jwtService.verify(token) as { sub: string; role: string };

      if (payload.role === 'admin') {
        request.user = payload;
        return true;
      }

      if (payload.role === 'application' && request.params.id && payload.sub === request.params.id) {
        request.user = payload;
        return true;
      }

      throw new UnauthorizedException('No tiene permiso para acceder a este recurso');
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
