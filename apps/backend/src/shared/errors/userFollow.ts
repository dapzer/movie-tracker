import { BadArgumentsError, NotFoundError } from "@/shared/errors/core"
import { CustomErrorOptions } from "@/shared/errors/customError"

export class UserFollowNotFoundError extends NotFoundError {
  readonly followerUserId: string
  readonly followingUserId: string

  constructor(args: { followerUserId: string, followingUserId: string } & CustomErrorOptions) {
    super(args.message ?? "Follow not found", { cause: args.cause, details: args.details })
    this.followerUserId = args.followerUserId
    this.followingUserId = args.followingUserId
  }
}

export class SelfFollowError extends BadArgumentsError {
  readonly userId: string

  constructor(args: { userId: string } & CustomErrorOptions) {
    super(args.message ?? "Users cannot follow themselves.", { cause: args.cause, details: args.details })
    this.userId = args.userId
  }
}

export class SelfUnfollowError extends BadArgumentsError {
  readonly userId: string

  constructor(args: { userId: string } & CustomErrorOptions) {
    super(args.message ?? "Users cannot unfollow themselves.", { cause: args.cause, details: args.details })
    this.userId = args.userId
  }
}
