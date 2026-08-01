import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '@/prisma/prisma.service';
import { HealthCheckResponseDto } from './dto/health-response.dto';

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
  @ApiResponse({ status: 200, description: 'Servicio y base de datos saludables', type: HealthCheckResponseDto })
  @ApiResponse({ status: 503, description: 'Servicio no disponible', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Error interno del servidor', type: ErrorResponseDto })
  check() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('prisma', this.prisma),
    ]);
  }
}
