import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ description: 'Indica que la operación falló', example: false })
  success!: boolean;

  @ApiProperty({ description: 'Código HTTP del error', example: 400 })
  statusCode!: number;

  @ApiProperty({ description: 'Nombre del error', example: 'Bad Request' })
  error!: string;

  @ApiProperty({ description: 'Mensajes descriptivos del error', example: ['El campo email es inválido'] })
  message!: string[];

  @ApiProperty({ description: 'Ruta que generó el error', example: '/applications' })
  path!: string;

  @ApiProperty({ description: 'Marca de tiempo ISO del error', example: '2026-08-01T16:30:00.000Z' })
  timestamp!: string;
}
