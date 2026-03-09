import { NotFoundError, UnauthorizedError } from "@/shared/errors/core"
import { CustomErrorOptions } from "@/shared/errors/customError"

export class UserNotFoundError extends NotFoundError {
  readonly userId?: string

  constructor(args?: { userId?: string } & CustomErrorOptions) {
    super(args?.message ?? "User not found", { cause: args?.cause, details: args?.details })
    this.userId = args?.userId
  }
}

export class UserUnauthorizedError extends UnauthorizedError {
  readonly userId: string
  readonly targetUserId: string

  constructor(args: { userId: string, targetUserId: string } & CustomErrorOptions) {
    super(args.message ?? "Unauthorized", { cause: args.cause, details: args.details })
    this.userId = args.userId
    this.targetUserId = args.targetUserId
  }
}
