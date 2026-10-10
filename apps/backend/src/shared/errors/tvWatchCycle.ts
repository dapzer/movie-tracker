import { ConflictError, NotFoundError, UnauthorizedError } from "@/shared/errors/core"
import { CustomErrorOptions } from "@/shared/errors/customError"

export class TvWatchCycleNotFoundError extends NotFoundError {
  readonly tvWatchCycleId: string

  constructor(args: { tvWatchCycleId: string } & CustomErrorOptions) {
    super(args.message ?? `TV watch cycle with id '${args.tvWatchCycleId}' doesn't exist.`, { cause: args.cause, details: args.details })
    this.tvWatchCycleId = args.tvWatchCycleId
  }
}

export class TvWatchCycleNotActiveError extends ConflictError {
  readonly tvWatchCycleId: string

  constructor(args: { tvWatchCycleId: string } & CustomErrorOptions) {
    super(args.message ?? `TV watch cycle with id '${args.tvWatchCycleId}' is already finished.`, { cause: args.cause, details: args.details })
    this.tvWatchCycleId = args.tvWatchCycleId
  }
}

export class TvWatchCycleUnauthorizedError extends UnauthorizedError {
  readonly userId?: string
  readonly tvWatchCycleId?: string

  constructor(args: { userId?: string, tvWatchCycleId?: string } & CustomErrorOptions) {
    super(args.message ?? "Unauthorized.", { cause: args.cause, details: args.details })
    this.userId = args.userId
    this.tvWatchCycleId = args.tvWatchCycleId
  }
}
