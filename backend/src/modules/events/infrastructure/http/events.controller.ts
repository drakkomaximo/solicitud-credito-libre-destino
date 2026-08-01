import { Controller, Sse } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventsService, ServerSentEvent } from '@/modules/events/application/services/events.service';

interface SseMessage {
  data: ServerSentEvent;
}

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Sse()
  @ApiOperation({
    summary: 'Notificaciones en tiempo real (SSE)',
    description: 'Flujo de eventos del servidor. El frontend se conecta a este endpoint para saber cuándo revalidar cachés (SSG/ISR).',
  })
  events(): Observable<SseMessage> {
    return this.eventsService.events$.pipe(
      map((event) => ({ data: event })),
    );
  }
}
