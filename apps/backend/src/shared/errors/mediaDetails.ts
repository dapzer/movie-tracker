import { InternalError, NotFoundError } from "@/shared/errors/core"
import { CustomErrorOptions } from "@/shared/errors/customError"

export class MediaDetailsNotFoundError extends NotFoundError {
  readonly mediaId: number
  readonly mediaType: string

  constructor(args: { mediaId: number, mediaType: string } & CustomErrorOptions) {
    super(args.message ?? "Media details not found", { cause: args.cause, details: args.details })
    this.mediaId = args.mediaId
    this.mediaType = args.mediaType
  }
}

export class MediaDetailsUpdateFailedError extends InternalError {
  readonly mediaId?: number
  readonly mediaType?: string

  constructor(args?: { mediaId?: number, mediaType?: string } & CustomErrorOptions) {
    super(args?.message ?? "Failed to create or update media details", { cause: args?.cause, details: args?.details })
    this.mediaId = args?.mediaId
    this.mediaType = args?.mediaType
  }
}

export class MediaItemsNotFoundError extends NotFoundError {
  constructor(args?: CustomErrorOptions) {
    super(args?.message ?? "Media items not found", { cause: args?.cause, details: args?.details })
  }
}
