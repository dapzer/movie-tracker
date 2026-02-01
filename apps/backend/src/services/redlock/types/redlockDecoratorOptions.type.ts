/**
 * Options for @Redlock decorator
 */
export interface RedlockDecoratorOptions {
  /**
   * Lock key - can be static string or function that generates key from method arguments
   */
  key: string | ((...args: any[]) => string)

  /**
   * Lock time-to-live in milliseconds
   * @default DEFAULT_TTL_MS (30000ms / 30 seconds)
   */
  ttl?: number

  /**
   * Number of retry attempts if lock acquisition fails
   * @default DEFAULT_RETRY_ATTEMPTS (3)
   */
  retryAttempts?: number

  /**
   * Delay between retry attempts in milliseconds
   * @default DEFAULT_RETRY_DELAY_MS (200ms)
   */
  retryDelay?: number
}
