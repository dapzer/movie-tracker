import { ExternalServiceError, NotFoundError } from "@/shared/errors/core"
import { CustomErrorOptions } from "@/shared/errors/customError"

export class SitemapFileNotFoundError extends NotFoundError {
  readonly fileLocation: string

  constructor(args: { fileLocation: string } & CustomErrorOptions) {
    super(args.message ?? `File ${args.fileLocation} not found`, { cause: args.cause, details: args.details })
    this.fileLocation = args.fileLocation
  }
}

export class SitemapSourceDataFetchError extends ExternalServiceError {
  constructor(args?: CustomErrorOptions) {
    super(args?.message ?? "Failed to get data for sitemap generation.", { cause: args?.cause, details: args?.details })
  }
}
