import { ExternalServiceError, InternalError } from "@/shared/errors/core"
import { CustomErrorOptions } from "@/shared/errors/customError"

export class AiProviderConfigurationError extends InternalError {
  constructor(args: CustomErrorOptions = {}) {
    super(args.message ?? "AI provider is not configured.", { cause: args.cause, details: args.details })
  }
}

export class AiProviderRequestError extends ExternalServiceError {
  constructor(args: CustomErrorOptions = {}) {
    super(args.message ?? "AI provider request failed.", { cause: args.cause, details: args.details })
  }
}

export class AiProviderInvalidResponseError extends ExternalServiceError {
  constructor(args: CustomErrorOptions = {}) {
    super(args.message ?? "AI provider returned an invalid structured response.", {
      cause: args.cause,
      details: args.details,
    })
  }
}

export class AiProviderTokenLimitError extends AiProviderInvalidResponseError {
  constructor(args: CustomErrorOptions = {}) {
    super({
      ...args,
      message: args.message ?? "AI provider used the entire token budget before returning structured content.",
    })
  }
}

export class AiProviderEmptyResponseError extends AiProviderInvalidResponseError {
  constructor(args: CustomErrorOptions = {}) {
    super({
      ...args,
      message: args.message ?? "AI provider returned empty or refused structured content.",
    })
  }
}
