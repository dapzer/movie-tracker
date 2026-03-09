import { NotFoundError, UnauthorizedError } from "@/shared/errors/core"
import { CustomErrorOptions } from "@/shared/errors/customError"

export class MediaItemNotFoundError extends NotFoundError {
  readonly mediaItemId: string

  constructor(args: { mediaItemId: string } & CustomErrorOptions) {
    super(args.message ?? `Media item with id '${args.mediaItemId}' doesn't exist.`, { cause: args.cause, details: args.details })
    this.mediaItemId = args.mediaItemId
  }
}

export class MediaItemUnauthorizedError extends UnauthorizedError {
  readonly userId: string
  readonly mediaItemId?: string

  constructor(args: { userId: string, mediaItemId?: string } & CustomErrorOptions) {
    super(args.message ?? "Unauthorized.", { cause: args.cause, details: args.details })
    this.userId = args.userId
    this.mediaItemId = args.mediaItemId
  }
}
