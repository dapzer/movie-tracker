import { BadArgumentsError, ExternalServiceError, InternalError } from "@/shared/errors/core"
import { CustomErrorOptions } from "@/shared/errors/customError"

export class ProxyFetchError extends ExternalServiceError {
  readonly path: string
  readonly statusCode?: number

  constructor(args: { path: string, statusCode?: number } & CustomErrorOptions) {
    super(args.message ?? `${args.statusCode ? `${args.statusCode}: ` : ""}Failed to get data from remote server.`, { cause: args.cause, details: args.details })
    this.path = args.path
    this.statusCode = args.statusCode
  }
}

export class ProxyImageFetchError extends ExternalServiceError {
  readonly path: string
  readonly statusCode?: number

  constructor(args: { path: string, statusCode?: number } & CustomErrorOptions) {
    super(args.message ?? `${args.statusCode ? `${args.statusCode}: ` : ""}Failed to get image from remote server.`, { cause: args.cause, details: args.details })
    this.path = args.path
    this.statusCode = args.statusCode
  }
}

export class ProxyUnsupportedContentTypeError extends BadArgumentsError {
  readonly contentType: string

  constructor(args: { contentType: string } & CustomErrorOptions) {
    super(args.message ?? `Unsorted content type: ${args.contentType}.`, { cause: args.cause, details: args.details })
    this.contentType = args.contentType
  }
}

export class ProxyProcessingError extends InternalError {
  readonly path: string

  constructor(args: { path: string } & CustomErrorOptions) {
    super(args.message ?? "Failed to process data received from remote server.", { cause: args.cause, details: args.details })
    this.path = args.path
  }
}
