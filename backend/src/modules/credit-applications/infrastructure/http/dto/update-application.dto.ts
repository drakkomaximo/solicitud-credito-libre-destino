import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateApplicationDto {
  @ApiPropertyOptional({ description: 'Ingresos mensuales', example: 5000000 })
  @IsNumber()
  @IsOptional()
  income?: number;

  @ApiPropertyOptional({ description: 'Gastos mensuales', example: 1500000 })
  @IsNumber()
  @IsOptional()
  expenses?: number;

  @ApiPropertyOptional({ description: 'Monto solicitado', example: 10000000 })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({ description: 'Plazo en meses', example: 24 })
  @IsInt()
  @IsOptional()
  term?: number;

  @ApiPropertyOptional({ description: 'Propósito del crédito', example: 'Viaje' })
  @IsString()
  @IsOptional()
  purpose?: string;

  @ApiPropertyOptional({ description: 'Autorización de datos personales', example: true })
  @IsBoolean()
  @IsOptional()
  dataAuthorized?: boolean;
}
