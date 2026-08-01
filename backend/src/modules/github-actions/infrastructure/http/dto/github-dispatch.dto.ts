import { ApiPropertyOptional } from '@nestjs/swagger';

export class GithubDispatchDto {
  @ApiPropertyOptional({ description: 'Tipo de evento a enviar', example: 'reference.created' })
  eventType?: string;

  @ApiPropertyOptional({ description: 'Carga útil del evento', example: { demo: true } })
  payload?: unknown;
}
