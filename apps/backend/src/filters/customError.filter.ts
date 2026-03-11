import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common"
import { HttpAdapterHost } from "@nestjs/core"
import {
  BadArgumentsError,
  ConflictError,
  ExternalServiceError,
  ForbiddenError,
  InternalError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableError,
} from "@/shared/errors/core"
import { CustomError } from "@/shared/errors/customError"
import { MediaRatingNotFoundError } from "@/shared/errors/mediaRating"

@Catch(CustomError)
export class CustomErrorFilter implements ExceptionFilter {
  logger = new Logger("CustomErrorFilter")
  // eslint-disable-next-line ts/no-unsafe-function-type
  customErrorStatusMap = new Map<Function, HttpStatus>([
    [BadArgumentsError, HttpStatus.BAD_REQUEST],
    [UnauthorizedError, HttpStatus.UNAUTHORIZED],
    [ForbiddenError, HttpStatus.FORBIDDEN],
    [NotFoundError, HttpStatus.NOT_FOUND],
    [ConflictError, HttpStatus.CONFLICT],
    [UnprocessableError, HttpStatus.UNPROCESSABLE_ENTITY],
    [ExternalServiceError, HttpStatus.BAD_GATEWAY],
    [InternalError, HttpStatus.INTERNAL_SERVER_ERROR],
  ])

  ignoredErrorsForLogging: Array<{
    path: string
    exactPath?: boolean
    methods: string[]
    // eslint-disable-next-line ts/no-unsafe-function-type
    errors: Function[]
  }> = [
    {
      path: "users",
      methods: ["GET"],
      errors: [UnauthorizedError],
    },
    {
      path: "release-subscriptions/by-media",
      methods: ["GET"],
      errors: [UnauthorizedError],
    },
    {
      path: "media-ratings/by-media",
      methods: ["GET"],
      errors: [UnauthorizedError, MediaRatingNotFoundError],
    },
    {
      path: "api/media-lists",
      exactPath: true,
      methods: ["GET"],
      errors: [UnauthorizedError],
    },
  ]

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
  }

  catch(exception: CustomError, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()
    const method = httpAdapter.getRequestMethod(ctx.getRequest())

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    for (const [errorType, errorStatus] of this.customErrorStatusMap.entries()) {
      if (exception instanceof errorType) {
        status = errorStatus
        break
      }
    }

    const path = httpAdapter.getRequestUrl(ctx.getRequest())

    const isLoggingIgnored = this.ignoredErrorsForLogging.some(
      (el) => {
        const pathMatch = el.exactPath ? el.path === path : path.includes(el.path)
        return pathMatch && el.methods.includes(method) && el.errors.some(error => exception instanceof error)
      },
    )

    if (!isLoggingIgnored) {
      // TODO: Use metadata after implementing json logging and log aggregation
      // const metadata: Record<string, unknown> = {}
      // for (const [key, value] of Object.entries(exception as unknown as Record<string, unknown>)) {
      //   if (
      //     key !== "message"
      //     && key !== "name"
      //     && key !== "stack"
      //     && key !== "cause"
      //     && key !== "details"
      //     && typeof value !== "function"
      //   ) {
      //     metadata[key] = value
      //   }
      // }

      this.logger.error({
        err: exception,
        path,
        method,
      }, `Error during request`)
    }

    const responseBody = {
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path,
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, status)
  }
}
