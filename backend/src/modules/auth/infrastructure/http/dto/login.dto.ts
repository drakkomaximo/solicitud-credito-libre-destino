import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Usuario administrador', example: 'admin' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ description: 'Contraseña de administrador', example: 'cambia_esto_en_produccion' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
