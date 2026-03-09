import { BadArgumentsError, ForbiddenError, NotFoundError, UnauthorizedError } from "@/shared/errors/core"
import { CustomErrorOptions } from "@/shared/errors/customError"

export class MediaListNotFoundError extends NotFoundError {
  readonly mediaListId: string

  constructor(args: { mediaListId: string } & CustomErrorOptions) {
    super(args.message ?? `Media list with id '${args.mediaListId}' doesn't exist.`, { cause: args.cause, details: args.details })
    this.mediaListId = args.mediaListId
  }
}

export class MediaListUnauthorizedError extends UnauthorizedError {
  readonly userId: string
  readonly mediaListId?: string

  constructor(args: { userId: string, mediaListId?: string } & CustomErrorOptions) {
    super(args.message ?? "Unauthorized.", { cause: args.cause, details: args.details })
    this.userId = args.userId
    this.mediaListId = args.mediaListId
  }
}

export class MediaListLimitReachedError extends ForbiddenError {
  readonly userId: string
  readonly limit: number

  constructor(args: { userId: string, limit: number } & CustomErrorOptions) {
    super(args.message ?? `You have reached the limit of ${args.limit} media lists.`, { cause: args.cause, details: args.details })
    this.userId = args.userId
    this.limit = args.limit
  }
}

export class SystemMediaListDeletionError extends BadArgumentsError {
  readonly mediaListId: string

  constructor(args: { mediaListId: string } & CustomErrorOptions) {
    super(args.message ?? "System media list cannot be deleted.", { cause: args.cause, details: args.details })
    this.mediaListId = args.mediaListId
  }
}

export class MediaListSelfLikeError extends BadArgumentsError {
  readonly userId: string
  readonly mediaListId: string

  constructor(args: { userId: string, mediaListId: string } & CustomErrorOptions) {
    super(args.message ?? "You cannot like your own media list.", { cause: args.cause, details: args.details })
    this.userId = args.userId
    this.mediaListId = args.mediaListId
  }
}

export class MediaListSelfDislikeError extends BadArgumentsError {
  readonly userId: string
  readonly mediaListId: string

  constructor(args: { userId: string, mediaListId: string } & CustomErrorOptions) {
    super(args.message ?? "You cannot dislike your own media list.", { cause: args.cause, details: args.details })
    this.userId = args.userId
    this.mediaListId = args.mediaListId
  }
}
