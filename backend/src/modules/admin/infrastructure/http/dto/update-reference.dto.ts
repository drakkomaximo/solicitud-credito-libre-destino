import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateReferenceDto {
  @ApiPropertyOptional({ description: 'Nuevo texto legible del valor', example: 'En borrador' })
  @IsString()
  @IsOptional()
  label?: string;

  @ApiPropertyOptional({ description: 'Nueva descripción del valor', example: 'Solicitud iniciada' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Activa o desactiva el valor', example: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
