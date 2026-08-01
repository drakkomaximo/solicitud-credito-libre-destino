import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiOkEnvelope } from '@/common/decorators/api-responses.decorator';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '@/prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Verificar estado de salud', description: 'Comprueba la conectividad con la base de datos.' })
  @ApiOkEnvelope('Servicio y base de datos saludables')
  @ApiResponse({ status: 503, description: 'Servicio no disponible', type: ErrorResponseDto })
  check() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('prisma', this.prisma),
    ]);
  }
}
