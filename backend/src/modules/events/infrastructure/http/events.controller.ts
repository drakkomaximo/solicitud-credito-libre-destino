import { Controller, Sse } from '@nestjs/common';
import { ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NoEnvelope } from '@/common/decorators/no-envelope.decorator';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';
import { EventsService, ServerSentEvent } from '@/modules/events/application/services/events.service';
import { ServerSentEventDto } from './dto/server-sent-event.dto';

interface SseMessage {
  data: ServerSentEvent;
}

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @NoEnvelope()
  @Sse()
  @ApiOperation({
    summary: 'Notificaciones en tiempo real (SSE)',
    description: 'Flujo de eventos del servidor. El frontend se conecta a este endpoint para saber cuándo revalidar cachés (SSG/ISR). Cada mensaje se emite en formato SSE: `data: {json}\n\n`.',
  })
  @ApiProduces('text/event-stream')
  @ApiResponse({ status: 200, description: 'Stream abierto; cada evento tiene la forma `data: <JSON>`', type: ServerSentEventDto })
  @ApiResponse({ status: 500, description: 'Error inesperado al iniciar el stream', type: ErrorResponseDto })
  events(): Observable<SseMessage> {
    return this.eventsService.events$.pipe(
      map((event) => ({ data: event })),
    );
  }
}
