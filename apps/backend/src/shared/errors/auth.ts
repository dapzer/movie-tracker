import {
  BadArgumentsError,
  ConflictError,
  ExternalServiceError,
  ForbiddenError,
  InternalError,
  NotFoundError,
} from "@/shared/errors/core"
import { CustomErrorOptions } from "@/shared/errors/customError"

export class UserAlreadyExistsError extends ConflictError {
  readonly email: string

  constructor(args: { email: string } & CustomErrorOptions) {
    super(args.message ?? "User already exists", { cause: args.cause, details: args.details })
    this.email = args.email
  }
}

export class InvalidCredentialsError extends BadArgumentsError {
  constructor(args?: CustomErrorOptions) {
    super(args?.message ?? "Email or password not valid", { cause: args?.cause, details: args?.details })
  }
}

export class EmailAlreadyConfirmedError extends BadArgumentsError {
  readonly email: string

  constructor(args: { email: string } & CustomErrorOptions) {
    super(args.message ?? "Email already confirmed", { cause: args.cause, details: args.details })
    this.email = args.email
  }
}

export class EmailAlreadyInUseError extends BadArgumentsError {
  readonly email: string

  constructor(args: { email: string } & CustomErrorOptions) {
    super(args.message ?? "Email already in use", { cause: args.cause, details: args.details })
    this.email = args.email
  }
}

export class FailedToSendEmailError extends InternalError {
  readonly email: string

  constructor(args: { email: string } & CustomErrorOptions) {
    super(args.message ?? "Failed to send an email", { cause: args.cause, details: args.details })
    this.email = args.email
  }
}

export class InvalidTokenError extends BadArgumentsError {
  constructor(args?: CustomErrorOptions) {
    super(args?.message ?? "Invalid token", { cause: args?.cause, details: args?.details })
  }
}

export class NoTokenProvidedError extends BadArgumentsError {
  constructor(args?: CustomErrorOptions) {
    super(args?.message ?? "No token provided", { cause: args?.cause, details: args?.details })
  }
}

export class NoCodeProvidedError extends BadArgumentsError {
  constructor(args?: CustomErrorOptions) {
    super(args?.message ?? "No code provided", { cause: args?.cause, details: args?.details })
  }
}

export class AlreadyAuthenticatedError extends ForbiddenError {
  constructor(args?: CustomErrorOptions) {
    super(args?.message ?? "Already authenticated", { cause: args?.cause, details: args?.details })
  }
}

export class SessionError extends InternalError {
  constructor(args?: CustomErrorOptions) {
    super(args?.message ?? "Session error", { cause: args?.cause, details: args?.details })
  }
}

export class UnknownProviderError extends BadArgumentsError {
  readonly provider: string

  constructor(args: { provider: string } & CustomErrorOptions) {
    super(args.message ?? "Unknown provider", { cause: args.cause, details: args.details })
    this.provider = args.provider
  }
}

export class EmailNotConfirmedError extends ForbiddenError {
  constructor(args?: CustomErrorOptions) {
    super(args?.message ?? "Email not confirmed", { cause: args?.cause, details: args?.details })
  }
}

export class OAuthTokenExternalServiceError extends ExternalServiceError {
  readonly provider: string
  readonly url: string

  constructor(args: { provider: string, url: string } & CustomErrorOptions) {
    super(args.message ?? `Failed to fetch tokens from ${args.url}`, { cause: args.cause, details: args.details })
    this.provider = args.provider
    this.url = args.url
  }
}

export class OAuthNoTokensError extends BadArgumentsError {
  readonly provider: string
  readonly url: string

  constructor(args: { provider: string, url: string } & CustomErrorOptions) {
    super(args.message ?? `No tokens ${args.url}`, { cause: args.cause, details: args.details })
    this.provider = args.provider
    this.url = args.url
  }
}

export class OAuthUserExternalServiceError extends ExternalServiceError {
  readonly provider: string
  readonly url: string

  constructor(args: { provider: string, url: string } & CustomErrorOptions) {
    super(args.message ?? `Failed to fetch user from ${args.url}`, { cause: args.cause, details: args.details })
    this.provider = args.provider
    this.url = args.url
  }
}

export class UserNotFoundError extends NotFoundError {
  readonly userId?: string
  readonly email?: string

  constructor(args?: { userId?: string, email?: string } & CustomErrorOptions) {
    super(args?.message ?? "User not found", { cause: args?.cause, details: args?.details })
    this.userId = args?.userId
    this.email = args?.email
  }
}
