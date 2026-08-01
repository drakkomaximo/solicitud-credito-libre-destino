import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseFormatInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Credit Applications API')
    .setDescription('Micrositio de solicitud de crédito de libre destino')
    .setVersion('1.0')
    .addTag('Solicitudes de crédito', 'Endpoints principales del flujo de crédito libre destino (prueba original)')
    .addTag('Admin', 'Gestión de referencias, limpieza de base de datos y tareas administrativas')
    .addTag('Dominios', 'Enumeraciones y valores de referencia versionados')
    .addTag('Seed', 'Población de datos de prueba')
    .addTag('Health', 'Health checks del servicio')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ErrorResponseDto, SuccessResponseDto, PaginatedResponseDto, PaginationMetaDto],
  });
  (document as any)['x-tagGroups'] = [
    { name: 'Solicitudes de crédito', tags: ['Solicitudes de crédito'] },
    { name: 'Complementarios', tags: ['Admin', 'Dominios', 'Seed', 'Health'] },
  ];
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
