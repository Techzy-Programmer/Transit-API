import {
  Catch,
  HttpStatus,
  ArgumentsHost,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(_: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = HttpStatus.NOT_FOUND;

    response.status(status).json({
      statusCode: status,
      message: 'The resource you are looking for does not exist',
      error: 'Not Found',
    });
  }
}
