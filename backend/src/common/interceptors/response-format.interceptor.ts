import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface CursorPaginatedShape<T = unknown> {
  data: T[];
  nextCursor: string | null;
  hasNextPage: boolean;
  limit: number;
}

interface StandardSuccessResponse<T = unknown> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    limit: number;
    nextCursor: string | null;
    hasNextPage: boolean;
  };
}

function isCursorPaginated(data: unknown): data is CursorPaginatedShape {
  if (typeof data !== 'object' || data === null) return false;
  const candidate = data as Record<string, unknown>;
  return (
    Array.isArray(candidate.data) &&
    typeof candidate.hasNextPage === 'boolean' &&
    (typeof candidate.nextCursor === 'string' || candidate.nextCursor === null) &&
    typeof candidate.limit === 'number'
  );
}

function getSuccessMessage(statusCode: number): string {
  switch (statusCode) {
    case 201:
      return 'Recurso creado con éxito';
    case 202:
      return 'Solicitud aceptada';
    case 204:
      return 'Operación realizada sin contenido';
    default:
      return 'Operación realizada con éxito';
  }
}

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<StandardSuccessResponse> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response?.statusCode ?? 200;

    return next.handle().pipe(
      map((rawData) => {
        if (isCursorPaginated(rawData)) {
          return {
            success: true,
            statusCode,
            message: getSuccessMessage(statusCode),
            data: rawData.data,
            meta: {
              limit: rawData.limit,
              nextCursor: rawData.nextCursor,
              hasNextPage: rawData.hasNextPage,
            },
          };
        }

        return {
          success: true,
          statusCode,
          message: getSuccessMessage(statusCode),
          data: rawData,
        };
      }),
    );
  }
}
