import { NotFoundError, UnauthorizedError } from "@/shared/errors/core"
import { CustomErrorOptions } from "@/shared/errors/customError"

export class TvEpisodeWatchNotFoundError extends NotFoundError {
  readonly tvEpisodeWatchId: string

  constructor(args: { tvEpisodeWatchId: string } & CustomErrorOptions) {
    super(args.message ?? `TV episode watch with id '${args.tvEpisodeWatchId}' doesn't exist.`, { cause: args.cause, details: args.details })
    this.tvEpisodeWatchId = args.tvEpisodeWatchId
  }
}

export class TvEpisodeWatchUnauthorizedError extends UnauthorizedError {
  readonly userId?: string
  readonly tvEpisodeWatchId?: string

  constructor(args: { userId?: string, tvEpisodeWatchId?: string } & CustomErrorOptions) {
    super(args.message ?? "Unauthorized.", { cause: args.cause, details: args.details })
    this.userId = args.userId
    this.tvEpisodeWatchId = args.tvEpisodeWatchId
  }
}
