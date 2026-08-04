import { randomUUID } from 'crypto';
import { NestFactory, Reflector } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '@/app.module';
import { ResponseFormatInterceptor } from '@/common/interceptors/response-format.interceptor';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';
import { SuccessResponseDto } from '@/common/dto/success-response.dto';
import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto';
import { PaginationMetaDto } from '@/common/dto/pagination-meta.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpLogger = new Logger('HTTP');

  (app as any).use((req: any, res: any, next: any) => {
    const requestId = req.headers['x-request-id'] || randomUUID();
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);
    const start = Date.now();
    res.on('finish', () => {
      httpLogger.log(
        `${req.method} ${req.originalUrl ?? req.url} ${res.statusCode} [${requestId}] +${Date.now() - start}ms`,
      );
    });
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseFormatInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new AllExceptionsFilter());
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  const rawCors = process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001';
  const allowedOrigins =
    rawCors === '*'
      ? ['*']
      : rawCors
          .split(',')
          .map((o) => o.trim())
          .filter(Boolean);
  const origin =
    allowedOrigins.length === 1
      ? (allowedOrigins[0] as any)
      : allowedOrigins[0] === '*'
        ? true
        : (allowedOrigins as any[]);
  app.enableCors({
    origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
  });
  app.setGlobalPrefix(apiPrefix);

  const config = new DocumentBuilder()
    .setTitle('Credit Applications API')
    .setDescription('Micrositio de solicitud de crédito de libre destino')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .addTag(
      'Solicitudes de crédito',
      'Endpoints principales del flujo de crédito libre destino (prueba original)',
    )
    .addTag(
      'Admin',
      'Gestión de referencias, limpieza de base de datos y tareas administrativas',
    )
    .addTag('Dominios', 'Enumeraciones y valores de referencia versionados')
    .addTag('Seed', 'Población de datos de prueba')
    .addTag('Health', 'Health checks del servicio')
    .addTag('Auth', 'Autenticación para administradores y clientes')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      ErrorResponseDto,
      SuccessResponseDto,
      PaginatedResponseDto,
      PaginationMetaDto,
    ],
  });
  (document as any)['x-tagGroups'] = [
    { name: 'Solicitudes de crédito', tags: ['Solicitudes de crédito'] },
    {
      name: 'Complementarios',
      tags: ['Admin', 'Dominios', 'Seed', 'Health', 'Auth'],
    },
  ];
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    customSiteTitle: 'Credit Applications API',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
