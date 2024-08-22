import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    if (exception instanceof BadRequestException) {
      const responseObj = exception.getResponse() as any;
      message = Array.isArray(responseObj.message)
        ? responseObj.message.join(', ')
        : responseObj.message;
    } else if (exception instanceof HttpException) {
      message = exception.message;
    }
    if (request.accepts('html')) {
      response.status(status).render('register', {
        message: `Request failed: ${message}`,
      });
    } else {
      response.status(status).json({
        status: 'error',
        message: `Request failed: ${message}`,
        data: null,
      });
    }
  }
}
