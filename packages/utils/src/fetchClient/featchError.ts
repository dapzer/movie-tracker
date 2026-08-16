export class FetchError extends Error {
  constructor(public statusCode: number, public message: string, public headers?: Record<string, string>) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
