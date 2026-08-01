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

  @IsNotEmpty()
  @IsString()
  documentNumber!: string;

  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  city!: string;
}
