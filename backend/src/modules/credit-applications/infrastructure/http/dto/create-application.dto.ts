import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({ enum: ['self-service', 'advisor'], description: 'Canal de originación' })
  @IsIn(['self-service', 'advisor'])
  @IsNotEmpty()
  channel!: string;

  @ApiPropertyOptional({ description: 'Identificador del asesor' })
  @IsOptional()
  @IsString()
  advisorId?: string;

  @ApiProperty({ enum: ['CC', 'CE', 'PA'], description: 'Tipo de documento' })
  @IsIn(['CC', 'CE', 'PA'])
  @IsNotEmpty()
  @IsString()
  documentType!: string;

  @ApiProperty({ description: 'Número de documento del solicitante', example: '1234567890' })
  @IsNotEmpty()
  @IsString()
  documentNumber!: string;

  @ApiProperty({ description: 'Nombres del solicitante', example: 'Juan' })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({ description: 'Apellidos del solicitante', example: 'Pérez' })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({ description: 'Número de teléfono del solicitante', example: '3001234567' })
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiProperty({ description: 'Correo electrónico del solicitante', example: 'juan.perez@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Ciudad de residencia del solicitante', example: 'Bogotá' })
  @IsNotEmpty()
  @IsString()
  city!: string;
}
