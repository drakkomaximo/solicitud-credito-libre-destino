import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from '@/modules/events/events.module';
import { GitHubActionsService } from './application/services/github-actions.service';
import { GitHubActionsListener } from './application/listeners/github-actions.listener';
import { GitHubActionsController } from './infrastructure/http/github-actions.controller';

@Module({
  imports: [ConfigModule, EventsModule],
  controllers: [GitHubActionsController],
  providers: [GitHubActionsService, GitHubActionsListener],
  exports: [GitHubActionsService],
})
export class GitHubActionsModule {}
