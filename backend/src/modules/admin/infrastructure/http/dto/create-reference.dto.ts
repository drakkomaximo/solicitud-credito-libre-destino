import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReferenceDto {
  @ApiProperty({
    description: 'Dominio o clasificación a la que pertenece el valor',
    example: 'application-status',
  })
  @IsString()
  @IsNotEmpty()
  domain!: string;

  @ApiProperty({
    description: 'Código identificador corto del valor',
    example: 'DRAFT',
  })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({
    description: 'Texto legible que representa el valor',
    example: 'Borrador',
  })
  @IsString()
  @IsNotEmpty()
  label!: string;

  @ApiPropertyOptional({
    description: 'Descripción adicional del significado del valor',
    example: 'Solicitud iniciada pero no completada',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Indica si el valor está activo y disponible para uso',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
