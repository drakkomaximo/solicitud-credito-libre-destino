import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';
import { SuccessResponseDto } from '@/common/dto/success-response.dto';
import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto';

export const ApiOkEnvelope = (description = 'Operación exitosa') =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description: `${description}. Respuesta envuelta en { success, statusCode, message, data } con el recurso en 'data'.`,
      type: SuccessResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Solicitud inválida',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Recurso no encontrado',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
      type: ErrorResponseDto,
    }),
  );

export const ApiCreatedEnvelope = (description = 'Recurso creado') =>
  applyDecorators(
    ApiResponse({
      status: 201,
      description: `${description}. Respuesta envuelta en { success, statusCode, message, data }.`,
      type: SuccessResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Datos de entrada inválidos',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
      type: ErrorResponseDto,
    }),
  );

export const ApiPaginatedEnvelope = (description = 'Listado obtenido') =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description: `${description}. Respuesta envuelta en { success, statusCode, message, data, meta } con los registros en 'data' y la paginación en 'meta'.`,
      type: PaginatedResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Parámetros de consulta inválidos',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Recurso no encontrado',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
      type: ErrorResponseDto,
    }),
  );

export const ApiNoContentEnvelope = (description = 'Operación exitosa') =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description: `${description}. Respuesta envuelta en { success, statusCode, message, data }.`,
      type: SuccessResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Solicitud inválida',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 403,
      description: 'No autorizado o clave incorrecta',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Recurso no encontrado',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
      type: ErrorResponseDto,
    }),
  );
