import { Inject } from "@nestjs/common"
import { RedlockDecoratorOptions } from "@/services/redlock/types/redlockDecoratorOptions.type"
import { ERROR_MESSAGES } from "./constants"
import { RedlockService } from "./redlock.service"

/**
 * Decorator that wraps a method with distributed lock acquisition and release
 *
 * Automatically acquires a lock before method execution and releases it after completion.
 * Supports both static and dynamic lock keys.
 *
 * @param options - Lock configuration options
 */
export function Redlock(options: RedlockDecoratorOptions): MethodDecorator {
  const injectRedlock = Inject(RedlockService)

  return (
    target: object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    // Inject RedlockService into the class instance
    injectRedlock(target, "redlockService")

    const originalMethod = descriptor.value

    if (typeof originalMethod !== "function") {
      throw new TypeError(ERROR_MESSAGES.DECORATOR_TARGET_INVALID)
    }

    // Replace method with lock-wrapped version
    descriptor.value = async function (
      this: { redlockService?: RedlockService },
      ...args: any[]
    ) {
      const redlockService = this.redlockService

      if (!redlockService) {
        throw new Error(ERROR_MESSAGES.REDLOCK_SERVICE_NOT_FOUND)
      }

      const key = typeof options.key === "function" ? options.key(...args) : options.key

      if (!key || typeof key !== "string") {
        throw new Error(ERROR_MESSAGES.INVALID_LOCK_KEY)
      }

      try {
        // Build options object without undefined values (exactOptionalPropertyTypes requirement)
        const lockOptions: { ttl?: number, retryAttempts?: number, retryDelay?: number } = {}
        if (options.ttl !== undefined)
          lockOptions.ttl = options.ttl
        if (options.retryAttempts !== undefined)
          lockOptions.retryAttempts = options.retryAttempts
        if (options.retryDelay !== undefined)
          lockOptions.retryDelay = options.retryDelay

        return await redlockService.using(
          key,
          async () => originalMethod.apply(this, args),
          lockOptions,
        )
      }
      catch (error) {
        if (error instanceof Error && error.message.includes("is already held")) {
          return
        }
        const enhancedError = new Error(
          `@Redlock decorator failed for key "${key}": ${error instanceof Error ? error.message : "Unknown error"}`,
          // { cause: error },
        )
        throw enhancedError
      }
    }

    return descriptor
  }
}
