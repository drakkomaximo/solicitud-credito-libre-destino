import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { CreditApplicationsModule } from '@/modules/credit-applications/credit-applications.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { SeedService } from '@/modules/seed/application/services/seed.service';
import { SeedController } from '@/modules/seed/infrastructure/http/seed.controller';

@Module({
  imports: [PrismaModule, CreditApplicationsModule, AuthModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
