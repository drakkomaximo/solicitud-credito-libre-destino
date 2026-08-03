import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  async cleanDatabase(): Promise<{ deletedApplications: number }> {
    this.logger.warn(
      'Se está ejecutando la limpieza de base de datos. Esta operación está habilitada por facilidad de modificación de información; en condiciones normales no debería usarse fuera de entornos de prueba.',
    );

    const result = await this.prisma.creditApplication.deleteMany({});
    return { deletedApplications: result.count };
  }
}
