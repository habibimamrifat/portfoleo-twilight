import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // NestJS HTTP exceptions
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const errorMessage = (
          exceptionResponse as {
            message: string | string[];
          }
        ).message;

        message = Array.isArray(errorMessage)
          ? errorMessage.join(', ')
          : errorMessage;
      }
    }

    // Prisma known request errors
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        // Unique constraint violation
        case 'P2002':
          statusCode = HttpStatus.CONFLICT;
          message = 'A record with this value already exists';
          break;

        // Foreign key constraint violation
        case 'P2003':
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Related record does not exist';
          break;

        // Record not found
        case 'P2025':
          statusCode = HttpStatus.NOT_FOUND;
          message = 'Requested record was not found';
          break;

        default:
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Database operation failed';
          break;
      }
    }

    // Prisma validation errors
    else if (exception instanceof Prisma.PrismaClientValidationError) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = 'Invalid database request';
    }

    // Unknown JavaScript errors
    else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
