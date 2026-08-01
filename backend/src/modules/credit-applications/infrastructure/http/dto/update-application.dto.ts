import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateApplicationDto {
  @ApiProperty({ description: 'Ingresos mensuales', example: 5000000 })
  @IsNumber()
  @IsNotEmpty()
  income!: number;

  @ApiProperty({ description: 'Gastos mensuales', example: 1500000 })
  @IsNumber()
  @IsNotEmpty()
  expenses!: number;

  @ApiProperty({ description: 'Monto solicitado', example: 10000000 })
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @ApiProperty({ description: 'Plazo en meses', example: 24 })
  @IsInt()
  @IsNotEmpty()
  term!: number;

  @ApiProperty({ description: 'Propósito del crédito', example: 'Viaje' })
  @IsString()
  @IsNotEmpty()
  purpose!: string;

  @ApiProperty({ description: 'Autorización de datos personales', example: true })
  @IsBoolean()
  @IsNotEmpty()
  dataAuthorized!: boolean;
}
