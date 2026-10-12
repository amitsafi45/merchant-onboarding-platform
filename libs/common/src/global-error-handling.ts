import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class GlobalErrorHandlingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // ---------------- HTTP EXCEPTION ----------------
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      message = exception.message;
    }
    const responseBody = {
      statusCode: httpStatus,
      success: false,
      message,
    };
    console.log(exception, 'lop');
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
