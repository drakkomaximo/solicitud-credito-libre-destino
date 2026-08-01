import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { filter, concatMap } from 'rxjs/operators';
import { EventsService, ServerSentEvent } from '@/modules/events/application/services/events.service';
import { GitHubActionsService } from '../services/github-actions.service';

@Injectable()
export class GitHubActionsListener implements OnModuleInit {
  private readonly logger = new Logger(GitHubActionsListener.name);

  constructor(
    private readonly eventsService: EventsService,
    private readonly gitHubActions: GitHubActionsService,
  ) {}

  onModuleInit(): void {
    this.eventsService.events$
      .pipe(
        filter((event) => this.shouldDispatch(event)),
        concatMap(async (event) => {
          await this.gitHubActions.dispatch(event);
        }),
      )
      .subscribe({
        error: (err) => this.logger.error('Error en listener de GitHub Actions', err),
      });
  }

  private shouldDispatch(event: ServerSentEvent): boolean {
    return event.type.startsWith('reference.') || event.type === 'database.cleaned';
  }
}
