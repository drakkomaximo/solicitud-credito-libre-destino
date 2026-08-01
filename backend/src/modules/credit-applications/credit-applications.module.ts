import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ReferencesModule } from '@/modules/references/references.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { CreateApplicationUseCase } from '@/modules/credit-applications/application/use-cases/create-application/create-application.use-case';
import { CreditApplicationsService } from '@/modules/credit-applications/application/services/credit-applications.service';
import { PrismaCreditApplicationRepository } from '@/modules/credit-applications/infrastructure/persistence/prisma-credit-application.repository';
import { CreditApplicationsController } from '@/modules/credit-applications/infrastructure/http/credit-applications.controller';
import { EnumsController } from '@/modules/credit-applications/infrastructure/http/enums.controller';

@Module({
  imports: [PrismaModule, ReferencesModule, AuthModule],
  controllers: [EnumsController, CreditApplicationsController],
  providers: [
    CreditApplicationsService,
    CreateApplicationUseCase,
    {
      provide: 'CreditApplicationRepository',
      useClass: PrismaCreditApplicationRepository,
    },
  ],
  exports: [CreditApplicationsService],
})
export class CreditApplicationsModule {}
