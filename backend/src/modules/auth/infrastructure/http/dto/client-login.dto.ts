import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ClientLoginDto {
  @ApiProperty({
    description: 'Número de documento del cliente',
    example: '123456789',
  })
  @IsNotEmpty()
  documentNumber!: string;

  @ApiProperty({
    description: 'Número de teléfono celular asociado a la solicitud',
    example: '3001234567',
  })
  @IsNotEmpty()
  phone!: string;
}
