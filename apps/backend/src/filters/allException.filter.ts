import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common"
import { HttpAdapterHost } from "@nestjs/core"
import { isArray } from "class-validator"

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  logger = new Logger("AllExceptions")

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    const httpStatus
      = exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const errorResponseMessage
      = exception instanceof HttpException
        ? (exception.getResponse() as any)?.message
        : ""

    const errorMessage
      = exception instanceof HttpException
        ? `${exception.message}${
          isArray(errorResponseMessage)
            ? `, ${errorResponseMessage?.join(", ")}`
            : ""
        }`
        : "Unknown error"

    const path = httpAdapter.getRequestUrl(ctx.getRequest())

    const responseBody = {
      statusCode: httpStatus,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path,
    }

    if (!(exception instanceof HttpException)) {
      this.logger.error(`Error during request to ${path}`, exception)
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
