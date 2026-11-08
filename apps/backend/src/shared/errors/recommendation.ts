import { NotFoundError } from "@/shared/errors/core"
import { CustomErrorOptions } from "@/shared/errors/customError"

export class RecommendationSessionNotFoundError extends NotFoundError {
  readonly sessionId: string

  constructor(args: { sessionId: string } & CustomErrorOptions) {
    super(args.message ?? `Recommendation session with id '${args.sessionId}' doesn't exist.`, {
      cause: args.cause,
      details: args.details,
    })
    this.sessionId = args.sessionId
  }
}
