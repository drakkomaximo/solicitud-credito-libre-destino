import { ApiProperty } from '@nestjs/swagger';

export class HealthResultDto {
  @ApiProperty({ description: 'Estado general del health check', example: 'ok' })
  status!: string;

  @ApiProperty({
    description: 'Indicadores que respondieron correctamente',
    example: { prisma: { status: 'up' } },
    type: 'object',
    additionalProperties: true,
  })
  info!: Record<string, unknown>;

  @ApiProperty({
    description: 'Indicadores con fallo (vacío si todo está bien)',
    example: {},
    type: 'object',
    additionalProperties: true,
  })
  error!: Record<string, unknown>;

  @ApiProperty({
    description: 'Detalle completo de cada indicador',
    example: { prisma: { status: 'up' } },
    type: 'object',
    additionalProperties: true,
  })
  details!: Record<string, unknown>;
}

export class HealthCheckResponseDto {
  @ApiProperty({ description: 'Indica que el health check fue exitoso', example: true })
  success!: boolean;

  @ApiProperty({ description: 'Código HTTP de la respuesta', example: 200 })
  statusCode!: number;

  @ApiProperty({ description: 'Mensaje resumen del health check', example: 'Recurso obtenido con éxito' })
  message!: string;

  @ApiProperty({ description: 'Resultado del health check de Terminus', type: () => HealthResultDto })
  data!: HealthResultDto;
}
