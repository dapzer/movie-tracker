import { ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HttpAdapterHost } from '@nestjs/core';
export declare class PrismaClientErrorFilter implements ExceptionFilter {
    private readonly httpAdapterHost;
    exceptions: {
        badRequest: {
            code: string;
            status: HttpStatus;
        };
        conflict: {
            code: string;
            status: HttpStatus;
        };
        notFound: {
            code: string;
            status: HttpStatus;
        };
    };
    constructor(httpAdapterHost: HttpAdapterHost);
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void;
}
