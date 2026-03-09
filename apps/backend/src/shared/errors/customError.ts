export interface CustomErrorOptions {
  message?: string
  cause?: unknown
  details?: Record<string, unknown>
}

export class CustomError extends Error {
  readonly details?: Record<string, unknown>
  readonly cause?: unknown

  constructor(message: string, options?: Omit<CustomErrorOptions, "message">) {
    super(message)
    this.name = this.constructor.name
    this.cause = options?.cause
    this.details = options?.details
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
