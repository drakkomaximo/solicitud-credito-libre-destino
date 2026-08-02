import { ApiProperty } from '@nestjs/swagger';

export class ServerSentEventDto {
  @ApiProperty({ description: 'Tipo del evento', example: 'reference.created' })
  type!: string;

  @ApiProperty({
    description: 'Carga útil del evento',
    example: { id: 'a1b2c3', domain: 'application-status', code: 'received' },
  })
  payload!: unknown;

  @ApiProperty({
    description: 'Marca de tiempo ISO 8601',
    example: '2026-08-01T18:00:00.000Z',
  })
  timestamp!: string;
}
