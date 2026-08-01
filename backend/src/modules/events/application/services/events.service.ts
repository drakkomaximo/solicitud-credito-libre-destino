import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

export interface ServerSentEvent {
  type: string;
  payload?: unknown;
  timestamp: string;
}

@Injectable()
export class EventsService {
  private readonly events = new Subject<ServerSentEvent>();

  readonly events$: Observable<ServerSentEvent> = this.events.asObservable();

  emit(event: Omit<ServerSentEvent, 'timestamp'>): void {
    this.events.next({ ...event, timestamp: new Date().toISOString() });
  }
}
