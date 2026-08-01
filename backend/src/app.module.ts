import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { HealthModule } from '@/modules/health/health.module';
import { CreditApplicationsModule } from '@/modules/credit-applications/credit-applications.module';
import { SeedModule } from '@/modules/seed/seed.module';
import { AdminModule } from '@/modules/admin/admin.module';
import { EventsModule } from '@/modules/events/events.module';
import { GitHubActionsModule } from '@/modules/github-actions/github-actions.module';

@Module({
  imports: [PrismaModule, HealthModule, CreditApplicationsModule, SeedModule, AdminModule, EventsModule, GitHubActionsModule],
})
export class AppModule {}
