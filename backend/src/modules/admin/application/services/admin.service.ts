import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async cleanDatabase(secret: string): Promise<{ deletedApplications: number }> {
    if (this.config.get('NODE_ENV') === 'production') {
      throw new ForbiddenException('Este servicio no está disponible en producción');
    }

    const expected = this.config.get<string>('ADMIN_SECRET');
    if (!expected || secret !== expected) {
      throw new UnauthorizedException('Clave de administrador inválida');
    }

    const result = await this.prisma.creditApplication.deleteMany({});
    return { deletedApplications: result.count };
  }
}
