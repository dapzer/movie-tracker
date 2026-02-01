// ========================================
// DEPENDENCY INJECTION TOKENS
// ========================================

export const REDLOCK_MODULE_OPTIONS = "REDLOCK_MODULE_OPTIONS"
export const REDLOCK_SERVICE = "REDLOCK_SERVICE"

// ========================================
// DEFAULT CONFIGURATION VALUES
// ========================================

/**
 * Default lock time-to-live in milliseconds (30 seconds)
 */
export const DEFAULT_TTL_MS = 30000

/**
 * Default number of retry attempts when lock acquisition fails
 */
export const DEFAULT_RETRY_ATTEMPTS = 3

/**
 * Default delay between retry attempts in milliseconds
 */
export const DEFAULT_RETRY_DELAY_MS = 200

/**
 * Minimum number of Redis nodes required to use RedLock algorithm.
 * Below this threshold, SimpleLock is used instead.
 */
export const MIN_NODES_FOR_REDLOCK = 3

// ========================================
// ERROR MESSAGES
// ========================================

export const ERROR_MESSAGES = {
  LOCK_MANAGER_NOT_INITIALIZED:
    "LockManager not initialized. Module initialization may have failed.",

  REDLOCK_SERVICE_NOT_FOUND:
    "RedlockService not found. Make sure RedlockModule is imported in your module.",

  INVALID_LOCK_KEY: "Lock key must be a non-empty string",

  DECORATOR_TARGET_INVALID: "@Redlock can only be applied to methods",

  LOCK_CREATION_FAILED: (key: string) => `Failed to create lock for key: ${key}`,

  INVALID_ASYNC_OPTIONS:
    "Invalid RedlockModuleAsyncOptions: must provide useFactory, useClass, or useExisting",
} as const
