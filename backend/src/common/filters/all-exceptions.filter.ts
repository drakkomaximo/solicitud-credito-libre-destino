import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

interface StandardErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string[];
  path: string;
  requestId?: string;
  timestamp: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : exception;

    let message: string | string[] = 'Error interno del servidor';
    let errorName = HttpStatus[status] ?? 'Internal Server Error';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      errorName = HttpStatus[status] ?? 'Error';
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null
    ) {
      const res = exceptionResponse as Record<string, unknown>;
      if (typeof res.message === 'string' || Array.isArray(res.message)) {
        message = res.message as string | string[];
      }
      if (typeof res.error === 'string') {
        errorName = res.error;
      }
    }

    const normalizedMessage = Array.isArray(message) ? message : [message];

    const requestId = request?.requestId;

    const body: StandardErrorResponse = {
      success: false,
      statusCode: status,
      error: errorName,
      message: normalizedMessage,
      path: request?.url ?? '',
      requestId,
      timestamp: new Date().toISOString(),
    };

    Logger.error(
      `[${requestId}] ${request?.method ?? 'UNKNOWN'} ${body.path} :: ${status} :: ${normalizedMessage.join(' | ')}`,
      exception instanceof Error ? exception.stack : undefined,
      'AllExceptionsFilter',
    );

    response.status(status).json(body);
  }
}
