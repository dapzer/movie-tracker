import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common"
import { DrizzleQueryError } from "drizzle-orm/errors"
import { Request, Response } from "express"
import { DatabaseError } from "pg"
import { config } from "@/shared/constants"

@Catch(DrizzleQueryError)
export class DrizzleClientErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger("DrizzleExceptionFilter")

  catch(exception: DrizzleQueryError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()
    const req = ctx.getRequest<Request>()

    const pgError = exception.cause as DatabaseError | undefined
    const code = pgError?.code

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = "Database error occurred"

    switch (code) {
      case "23505": // unique violation
        status = HttpStatus.CONFLICT
        message = "Record already exists"
        break

      case "23503": // foreign key violation
        status = HttpStatus.BAD_REQUEST
        message = "Invalid reference — related record does not exist"
        break

      case "23502": // not null violation
        status = HttpStatus.BAD_REQUEST
        message = "Missing required field"
        break

      default:
        this.logger.error(`[${code}]: ${pgError?.message}`, exception.stack)
    }

    if (config.NODE_ENV === "development") {
      message += pgError ? ` - ${pgError.message} (${pgError.detail})` : ""
      this.logger.error(`[${code}]: ${message}`, exception)
    }

    res.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: req.url,
    })
  }
}
