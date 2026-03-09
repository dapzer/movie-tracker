import { ForbiddenError } from "@/shared/errors/core"
import { CustomErrorOptions } from "@/shared/errors/customError"

export class PermissionDeniedError extends ForbiddenError {
  readonly userId?: string
  readonly requiredRoles?: string[]

  constructor(args?: { userId?: string, requiredRoles?: string[] } & CustomErrorOptions) {
    super(args?.message ?? "Permission denied", { cause: args?.cause, details: args?.details })
    this.userId = args?.userId
    this.requiredRoles = args?.requiredRoles
  }
}
