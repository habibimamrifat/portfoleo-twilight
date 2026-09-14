import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type ResponseType<T = null> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  path?: string;
  timestamp?: string;
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ResponseType<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseType<T>> {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();

    const message =
      this.reflector.get<string>('response_message', context.getHandler()) ??
      'Request successful';

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: response.statusCode,
        message,
        data,
        path: request.url,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
