import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async cleanDatabase(): Promise<{ deletedApplications: number }> {
    if (this.config.get('NODE_ENV') === 'production') {
      throw new ForbiddenException('Este servicio no está disponible en producción');
    }

    const result = await this.prisma.creditApplication.deleteMany({});
    return { deletedApplications: result.count };
  }
}
