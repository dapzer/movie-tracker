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
import { ProxyFetchNotFoundError, ProxyImageNotFoundError } from "@/shared/errors/proxy"
import { ReleaseSubscriptionNotFoundError } from "@/shared/errors/releaseSubscription"

function matchPath(pattern: string, actualPath: string): boolean {
  if (pattern.includes(":") || pattern.includes("*")) {
    const regexStr = pattern
      .replace(/:[^/]+/g, "[^/?]+")
      .replace(/\*[^/]*/g, ".+")
    const regex = new RegExp(`^${regexStr}(?:\\?.*)?$`)
    return regex.test(actualPath)
  }
  return pattern === actualPath
}

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
    methods: string[]
    // eslint-disable-next-line ts/no-unsafe-function-type
    errors: Function[]
  }> = [
    {
      path: "/api/users/me",
      methods: ["GET"],
      errors: [UnauthorizedError],
    },
    {
      path: "/api/release-subscriptions/by-media/:mediaId",
      methods: ["GET"],
      errors: [UnauthorizedError, ReleaseSubscriptionNotFoundError],
    },
    {
      path: "/api/media-ratings/by-media/:mediaId",
      methods: ["GET"],
      errors: [UnauthorizedError, MediaRatingNotFoundError],
    },
    {
      path: "/api/media-lists",
      methods: ["GET"],
      errors: [UnauthorizedError],
    },
    {
      path: "/api/proxy/content/*everything",
      methods: ["GET"],
      errors: [ProxyFetchNotFoundError],
    },
    {
      path: "/api/proxy/image/*everything",
      methods: ["GET"],
      errors: [ProxyImageNotFoundError],
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
        const pathMatch = matchPath(el.path, path)
        return pathMatch && el.methods.includes(method) && el.errors.some(error => exception instanceof error)
      },
    )

    if (!isLoggingIgnored) {
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
