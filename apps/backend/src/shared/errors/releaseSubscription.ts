import { ForbiddenError, NotFoundError } from "@/shared/errors/core"
import { CustomErrorOptions } from "@/shared/errors/customError"

export class ReleaseSubscriptionNotFoundError extends NotFoundError {
  readonly subscriptionId: string

  constructor(args: { subscriptionId: string } & CustomErrorOptions) {
    super(args.message ?? "Release subscription not found", { cause: args.cause, details: args.details })
    this.subscriptionId = args.subscriptionId
  }
}

export class ReleaseSubscriptionPermissionDeniedError extends ForbiddenError {
  readonly userId: string
  readonly subscriptionId: string

  constructor(args: { userId: string, subscriptionId: string } & CustomErrorOptions) {
    super(args.message ?? "Permission denied", { cause: args.cause, details: args.details })
    this.userId = args.userId
    this.subscriptionId = args.subscriptionId
  }
}
