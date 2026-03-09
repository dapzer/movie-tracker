import { ForbiddenError, InternalError, NotFoundError, UnauthorizedError } from "@/shared/errors/core"
import { CustomErrorOptions } from "@/shared/errors/customError"

export class MediaRatingNotFoundError extends NotFoundError {
  readonly mediaRatingId?: string
  readonly mediaId?: number

  constructor(args: { mediaRatingId?: string, mediaId?: number } & CustomErrorOptions) {
    super(args.message ?? `Media rating${args.mediaRatingId ? ` with id '${args.mediaRatingId}'` : args.mediaId ? ` with mediaId '${args.mediaId}'` : ""} doesn't exist.`, { cause: args.cause, details: args.details })
    this.mediaRatingId = args.mediaRatingId
    this.mediaId = args.mediaId
  }
}

export class MediaRatingUnauthorizedError extends UnauthorizedError {
  readonly userId: string
  readonly mediaRatingId?: string

  constructor(args: { userId: string, mediaRatingId?: string } & CustomErrorOptions) {
    super(args.message ?? "Unauthorized.", { cause: args.cause, details: args.details })
    this.userId = args.userId
    this.mediaRatingId = args.mediaRatingId
  }
}

export class MediaRatingPermissionDeniedError extends ForbiddenError {
  readonly userId: string

  constructor(args: { userId: string } & CustomErrorOptions) {
    super(args.message ?? "Permission denied", { cause: args.cause, details: args.details })
    this.userId = args.userId
  }
}

export class MediaDetailsCreationFailedError extends InternalError {
  readonly mediaId: number
  readonly mediaType: string

  constructor(args: { mediaId: number, mediaType: string } & CustomErrorOptions) {
    super(args.message ?? `Media details with mediaId '${args.mediaId}' and mediaType '${args.mediaType}' doesn't exist and couldn't be created.`, { cause: args.cause, details: args.details })
    this.mediaId = args.mediaId
    this.mediaType = args.mediaType
  }
}
