import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus, BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GeneralResponseDto } from './response/dto/general-response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    if (exception instanceof BadRequestException) {
      const responseObj = exception.getResponse() as any;
      message = Array.isArray(responseObj.message) ? responseObj.message.join(', ') : responseObj.message;
    } else if (exception instanceof HttpException) {
      message = exception.message;
    }

    response.status(status).json({
      status: 'error',
      message: `Request failed: ${message}`,
      data: null,
    });
  }
}
