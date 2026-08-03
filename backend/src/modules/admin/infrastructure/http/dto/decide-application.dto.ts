import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export const APPLICATION_DECISIONS = ['APPROVED', 'REJECTED'] as const;
export type ApplicationDecision = (typeof APPLICATION_DECISIONS)[number];

export class DecideApplicationDto {
  @ApiProperty({
    description: 'Decisión final sobre la solicitud',
    enum: APPLICATION_DECISIONS,
    example: 'APPROVED',
  })
  @IsIn(APPLICATION_DECISIONS)
  decision!: ApplicationDecision;

  @ApiPropertyOptional({
    description: 'Motivo de la decisión (recomendado al rechazar)',
    example: 'Capacidad de pago insuficiente',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
