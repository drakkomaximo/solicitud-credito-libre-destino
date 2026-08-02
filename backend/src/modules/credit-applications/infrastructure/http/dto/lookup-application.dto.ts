import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LookupApplicationDto {
  @ApiProperty({
    description: 'Número de documento del solicitante',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  documentNumber!: string;

  @ApiProperty({
    description: 'Teléfono asociado a la solicitud',
    example: '3001234567',
  })
  @IsString()
  @IsNotEmpty()
  phone!: string;
}
