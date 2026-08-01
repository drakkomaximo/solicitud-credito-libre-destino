import { Body, Controller, ForbiddenException, Headers, Post } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';
import { EventsService } from '@/modules/events/application/services/events.service';
import { GitHubActionsService } from '@/modules/github-actions/application/services/github-actions.service';
import { GithubDispatchDto } from './dto/github-dispatch.dto';

@ApiTags('GitHub Actions')
@Controller('github')
export class GitHubActionsController {
  constructor(
    private readonly gitHubActions: GitHubActionsService,
    private readonly eventsService: EventsService,
    private readonly config: ConfigService,
  ) {}

  @Post('dispatch')
  @ApiOperation({
    summary: 'Disparar GitHub Actions manualmente',
    description: 'Envía un repository_dispatch a GitHub con el evento indicado. Requiere x-admin-secret.',
  })
  @ApiHeader({ name: 'x-admin-secret', description: 'Clave secreta de administrador', required: true })
  @ApiBody({ type: GithubDispatchDto })
  @ApiResponse({ status: 201, description: 'Dispatch enviado' })
  @ApiResponse({ status: 403, description: 'Clave administrativa inválida', type: ErrorResponseDto })
  async dispatch(
    @Headers('x-admin-secret') secret: string,
    @Body() dto: GithubDispatchDto,
  ): Promise<{ sent: boolean }> {
    const expected = this.config.get<string>('ADMIN_SECRET');
    if (!secret || secret !== expected) {
      throw new ForbiddenException('Clave administrativa inválida');
    }

    const event = {
      type: dto.eventType ?? 'manual.dispatch',
      payload: dto.payload ?? { source: 'manual' },
    };

    this.eventsService.emit(event);
    await this.gitHubActions.dispatch({ ...event, timestamp: new Date().toISOString() });

    return { sent: true };
  }
}
