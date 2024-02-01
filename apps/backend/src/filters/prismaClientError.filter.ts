import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@movie-tracker/database';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientErrorFilter implements ExceptionFilter {
  exceptions = {
    badRequest: {
      code: 'P2000',
      status: HttpStatus.BAD_REQUEST,
    },
    conflict: {
      code: 'P2002',
      status: HttpStatus.CONFLICT,
    },
    notFound: {
      code: 'P2025',
      status: HttpStatus.NOT_FOUND,
    },
  };

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status = HttpStatus.BAD_REQUEST;
    let message = 'Unexpected error';

    if (exception.code === this.exceptions.conflict.code) {
      const nonUniqueFields = (exception.meta.target as string || '').split('_');
      message = `Field(s) '${nonUniqueFields
        .slice(1, -1)
        .join(', ')}' must be unique.`;
    } else if (exception.code === this.exceptions.notFound.code) {
      status = this.exceptions.conflict.status;
      message = 'Not found';
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    });
  }
}
