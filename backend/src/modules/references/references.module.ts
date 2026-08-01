import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ReferencesService } from './application/services/references.service';

@Module({
  imports: [PrismaModule],
  providers: [ReferencesService],
  exports: [ReferencesService],
})
export class ReferencesModule {}
