import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { HealthModule } from '@/modules/health/health.module';
import { CreditApplicationsModule } from '@/modules/credit-applications/credit-applications.module';
import { SeedModule } from '@/modules/seed/seed.module';
import { AdminModule } from '@/modules/admin/admin.module';

@Module({
  imports: [PrismaModule, HealthModule, CreditApplicationsModule, SeedModule, AdminModule],
})
export class AppModule {}
