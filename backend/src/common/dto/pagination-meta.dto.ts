import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Cantidad de registros solicitados',
    example: 10,
  })
  limit!: number;

  @ApiProperty({
    description:
      'Cursor para la siguiente página; null si no hay más resultados',
    example: 'a1b2c3d4',
    nullable: true,
  })
  nextCursor!: string | null;

  @ApiProperty({
    description: 'Indica si existe una página siguiente',
    example: true,
  })
  hasNextPage!: boolean;
}
