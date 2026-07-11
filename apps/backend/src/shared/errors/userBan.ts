import { NotFoundError } from "@/shared/errors/core"
import { CustomErrorOptions } from "@/shared/errors/customError"

export class UserBanNotFoundError extends NotFoundError {
  readonly userBanId: string

  constructor(args: { userBanId: string } & CustomErrorOptions) {
    super(
      args.message ?? "User ban doesn't exist.",
      { cause: args.cause, details: args.details },
    )
    this.userBanId = args.userBanId
  }
}
