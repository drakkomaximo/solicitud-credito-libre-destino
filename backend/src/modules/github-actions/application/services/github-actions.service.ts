import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerSentEvent } from '@/modules/events/application/services/events.service';

@Injectable()
export class GitHubActionsService {
  private readonly logger = new Logger(GitHubActionsService.name);

  constructor(private readonly config: ConfigService) {}

  async dispatch(event: ServerSentEvent): Promise<void> {
    const token = this.config.get<string>('GITHUB_TOKEN');
    const owner = this.config.get<string>('GITHUB_OWNER');
    const repo = this.config.get<string>('GITHUB_REPO');

    if (!token || !owner || !repo) {
      this.logger.debug('GitHub Actions no configurado; omitiendo dispatch');
      return;
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/dispatches`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${token}`,
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_type: 'solicitud-cambio',
            client_payload: event,
          }),
        },
      );

      if (!response.ok) {
        const body = await response.text().catch(() => 'sin cuerpo');
        this.logger.warn(`GitHub Actions respondió ${response.status}: ${body}`);
      } else {
        this.logger.debug(`GitHub Actions dispatch enviado para ${event.type}`);
      }
    } catch (error) {
      this.logger.error('No se pudo enviar repository_dispatch a GitHub', (error as Error).message);
    }
  }
}
