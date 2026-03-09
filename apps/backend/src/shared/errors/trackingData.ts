import { UnauthorizedError } from "@/shared/errors/core"
import { CustomErrorOptions } from "@/shared/errors/customError"

export class TrackingDataUnauthorizedError extends UnauthorizedError {
  readonly userId: string
  readonly trackingDataId: string

  constructor(args: { userId: string, trackingDataId: string } & CustomErrorOptions) {
    super(args.message ?? "Unauthorized.", { cause: args.cause, details: args.details })
    this.userId = args.userId
    this.trackingDataId = args.trackingDataId
  }
}
