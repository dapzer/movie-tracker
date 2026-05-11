import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common"
import { HttpAdapterHost } from "@nestjs/core"
import { ZodValidationException } from "nestjs-zod"
import { ZodError } from "zod"

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  logger = new Logger("AllExceptions")

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    const httpStatus
      = exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const rawExceptionResponse
      = exception instanceof HttpException
        ? exception.getResponse()
        : undefined

    const exceptionResponse
      = rawExceptionResponse && typeof rawExceptionResponse === "object"
        ? rawExceptionResponse as { message?: string | string[], errors?: unknown }
        : undefined

    const formatValidationDetails = (issues: ZodError["issues"]) => {
      const details = issues
        .map((issue) => {
          const path = issue.path
            .filter(part => typeof part === "string" || typeof part === "number")
            .map(part => String(part))
            .join(".")

          if (!path) {
            return issue.message
          }

          return `${path.charAt(0).toUpperCase()}${path.slice(1)} - ${issue.message}`
        })

      return details.length
        ? `Bad request. ${details.join(", ")}`
        : "Bad request"
    }

    let validationMessage: string | undefined

    if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError()

      if (zodError instanceof ZodError) {
        validationMessage = formatValidationDetails(zodError.issues)
      }
      else {
        validationMessage = "Bad request"
      }
    }
    else if (httpStatus === HttpStatus.BAD_REQUEST && Array.isArray(exceptionResponse?.message)) {
      validationMessage = exceptionResponse.message.length
        ? `Bad request. ${exceptionResponse.message.join(", ")}`
        : "Bad request"
    }

    const errorMessage
      = exception instanceof HttpException
        ? (validationMessage
          || (typeof exceptionResponse?.message === "string"
            ? exceptionResponse.message
            : exception.message))
        : "Unknown error"

    const path = httpAdapter.getRequestUrl(ctx.getRequest())
    const method = httpAdapter.getRequestMethod(ctx.getRequest())

    if (!(exception instanceof HttpException)) {
      const body = {
        err: exception,
        path,
        method,
      }

      this.logger.warn(body, `Error during request`)
    }

    const responseBody = {
      statusCode: httpStatus,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path,
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
