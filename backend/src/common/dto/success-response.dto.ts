import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({ description: 'Indica que la operación fue exitosa', example: true })
  success!: boolean;

  @ApiProperty({ description: 'Código HTTP de la respuesta', example: 200 })
  statusCode!: number;

  @ApiProperty({ description: 'Mensaje resumen de la operación', example: 'Operación realizada con éxito' })
  message!: string;

  @ApiProperty({ description: 'Carga útil de la respuesta. Su forma depende del endpoint.', example: {} })
  data!: unknown;
}
