import { Module } from '@nestjs/common';
import { EventsService } from '@/modules/events/application/services/events.service';
import { EventsController } from '@/modules/events/infrastructure/http/events.controller';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
