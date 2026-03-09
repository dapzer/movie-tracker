import { CustomError, CustomErrorOptions } from "@/shared/errors/customError"

export class BadArgumentsError extends CustomError {
  constructor(message = "Bad arguments", options?: Omit<CustomErrorOptions, "message">) {
    super(message, options)
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized", options?: Omit<CustomErrorOptions, "message">) {
    super(message, options)
  }
}

export class ForbiddenError extends CustomError {
  constructor(message = "Forbidden", options?: Omit<CustomErrorOptions, "message">) {
    super(message, options)
  }
}

export class NotFoundError extends CustomError {
  constructor(message = "Not found", options?: Omit<CustomErrorOptions, "message">) {
    super(message, options)
  }
}

export class ConflictError extends CustomError {
  constructor(message = "Conflict", options?: Omit<CustomErrorOptions, "message">) {
    super(message, options)
  }
}

export class UnprocessableError extends CustomError {
  constructor(message = "Unprocessable entity", options?: Omit<CustomErrorOptions, "message">) {
    super(message, options)
  }
}

export class InternalError extends CustomError {
  constructor(message = "Internal server error", options?: Omit<CustomErrorOptions, "message">) {
    super(message, options)
  }
}

export class ExternalServiceError extends CustomError {
  constructor(message = "External service error", options?: Omit<CustomErrorOptions, "message">) {
    super(message, options)
  }
}
