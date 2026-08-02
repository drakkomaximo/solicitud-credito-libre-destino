import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthService } from './application/services/auth.service';
import { AuthController } from './infrastructure/http/auth.controller';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { ApplicationOrAdminGuard } from './infrastructure/guards/application-or-admin.guard';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '8h') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, ApplicationOrAdminGuard],
  exports: [JwtAuthGuard, ApplicationOrAdminGuard, AuthService, JwtModule],
})
export class AuthModule {}
