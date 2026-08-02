import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginatedResponseDto {
  @ApiProperty({
    description: 'Indica que la operación fue exitosa',
    example: true,
  })
  success!: boolean;

  @ApiProperty({ description: 'Código HTTP de la respuesta', example: 200 })
  statusCode!: number;

  @ApiProperty({
    description: 'Mensaje resumen de la operación',
    example: 'Operación realizada con éxito',
  })
  message!: string;

  @ApiProperty({
    description:
      'Listado de registros. La forma de cada ítem depende del endpoint.',
    example: [],
    isArray: true,
  })
  data!: unknown[];

  @ApiProperty({
    description: 'Metadatos de paginación por cursor',
    type: () => PaginationMetaDto,
  })
  meta!: PaginationMetaDto;
}
