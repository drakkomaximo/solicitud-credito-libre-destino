import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/prisma/prisma.module';
import { ReferencesModule } from '@/modules/references/references.module';
import { AdminService } from '@/modules/admin/application/services/admin.service';
import { AdminController } from '@/modules/admin/infrastructure/http/admin.controller';

@Module({
  imports: [ConfigModule, PrismaModule, ReferencesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
