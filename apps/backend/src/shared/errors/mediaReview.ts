import { ConflictError, ForbiddenError, NotFoundError, UnauthorizedError } from "@/shared/errors/core"
import { CustomErrorOptions } from "@/shared/errors/customError"

export class MediaReviewNotFoundError extends NotFoundError {
  readonly mediaReviewId?: string
  readonly mediaId?: number

  constructor(args: { mediaReviewId?: string, mediaId?: number } & CustomErrorOptions) {
    super(
      args.message
      ?? `Media review doesn't exist`,
      { cause: args.cause, details: args.details },
    )
    this.mediaReviewId = args.mediaReviewId
    this.mediaId = args.mediaId
  }
}

export class MediaReviewUnauthorizedError extends UnauthorizedError {
  readonly userId: string
  readonly mediaReviewId?: string

  constructor(args: { userId: string, mediaReviewId?: string } & CustomErrorOptions) {
    super(args.message ?? "Unauthorized.", { cause: args.cause, details: args.details })
    this.userId = args.userId
    this.mediaReviewId = args.mediaReviewId
  }
}

export class MediaReviewPermissionError extends ForbiddenError {
  readonly userId?: string
  readonly requiredRoles?: string[]

  constructor(args?: { userId?: string, requiredRoles?: string[] } & CustomErrorOptions) {
    super(args?.message ?? "Permission denied", { cause: args?.cause, details: args?.details })
    this.userId = args?.userId
    this.requiredRoles = args?.requiredRoles
  }
}

export class MediaReviewAlreadyExistsError extends ConflictError {
  readonly userId: string
  readonly mediaId: number

  constructor(args: { userId: string, mediaId: number } & CustomErrorOptions) {
    super(
      args.message ?? `Media review already exists.`,
      { cause: args.cause, details: args.details },
    )
    this.userId = args.userId
    this.mediaId = args.mediaId
  }
}

export class MediaReviewLikeNotFoundError extends NotFoundError {
  readonly mediaReviewLikeId?: string

  constructor(args: { mediaReviewLikeId?: string } & CustomErrorOptions) {
    super(
      args.message ?? `Media review like doesn't exist.`,
      { cause: args.cause, details: args.details },
    )
    this.mediaReviewLikeId = args.mediaReviewLikeId
  }
}

export class MediaReviewLikeAlreadyExistsError extends ConflictError {
  readonly userId: string
  readonly mediaReviewId: string

  constructor(args: { userId: string, mediaReviewId: string } & CustomErrorOptions) {
    super(
      args.message ?? `Media review like for review already exists.`,
      { cause: args.cause, details: args.details },
    )
    this.userId = args.userId
    this.mediaReviewId = args.mediaReviewId
  }
}

export class MediaReviewDislikeNotFoundError extends NotFoundError {
  readonly mediaReviewDislikeId?: string

  constructor(args: { mediaReviewDislikeId?: string } & CustomErrorOptions) {
    super(
      args.message ?? `Media review dislike doesn't exist.`,
      { cause: args.cause, details: args.details },
    )
    this.mediaReviewDislikeId = args.mediaReviewDislikeId
  }
}

export class MediaReviewDislikeAlreadyExistsError extends ConflictError {
  readonly userId: string
  readonly mediaReviewId: string

  constructor(args: { userId: string, mediaReviewId: string } & CustomErrorOptions) {
    super(
      args.message ?? `Media review dislike for review already exists.`,
      { cause: args.cause, details: args.details },
    )
    this.userId = args.userId
    this.mediaReviewId = args.mediaReviewId
  }
}
