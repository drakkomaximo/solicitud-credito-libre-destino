import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '@/prisma/prisma.service';
import { HealthCheckResponseDto, HealthCheckUnhealthyResponseDto } from './dto/health-response.dto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
  ) {}

  @ApiResponse({ status: 200, description: 'Todos los indicadores responden correctamente. `data.status` será `ok`.', type: HealthCheckResponseDto })
  @ApiResponse({ status: 503, description: 'Al menos un indicador reporta fallo. `data.status` será `error` y `data.error` contendrá los indicadores caídos.', type: HealthCheckUnhealthyResponseDto })
  @ApiResponse({ status: 500, description: 'Error inesperado del servidor (no producido por Terminus).', type: ErrorResponseDto })
  @ApiOperation({ summary: 'Verificar estado de salud', description: 'Comprueba la conectividad con la base de datos. Devuelve 200 si todos los indicadores están up o 503 si alguno falla.' })
  @HealthCheck()
  @Get()
  check() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('prisma', this.prisma),
    ]);
  }
}
