import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class GlobalFilterFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
