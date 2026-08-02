import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

interface StandardErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string[];
  path: string;
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

    const body: StandardErrorResponse = {
      success: false,
      statusCode: status,
      error: errorName,
      message: normalizedMessage,
      path: request?.url ?? '',
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(body);
  }
}
