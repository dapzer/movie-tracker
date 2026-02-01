import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common"
import { Lock, LockHandle, LockManager, LockManagerConfig } from "redlock-universal"
import { RedlockModuleOptions } from "@/services/redlock/types/redlockModuleOptions.type"
import { DEFAULT_TTL_MS, ERROR_MESSAGES, MIN_NODES_FOR_REDLOCK, REDLOCK_MODULE_OPTIONS } from "./constants"

/**
 * Service for managing distributed locks using redlock-universal
 */
@Injectable()
export class RedlockService implements OnModuleInit, OnModuleDestroy {
  private lockManager?: LockManager
  private readonly locks = new Map<string, Lock>()
  private readonly defaultTtl: number

  constructor(
    @Inject(REDLOCK_MODULE_OPTIONS)
    private readonly options: RedlockModuleOptions,
  ) {
    this.defaultTtl = options.defaultTtl ?? DEFAULT_TTL_MS
  }

  async onModuleInit(): Promise<void> {
    try {
      const retryConfig = this.getRetryConfig()
      const config: LockManagerConfig = {
        nodes: [...this.options.nodes], // Create mutable copy for LockManager
        ...(retryConfig.retryAttempts !== undefined && {
          defaultRetryAttempts: retryConfig.retryAttempts,
        }),
        ...(retryConfig.retryDelay !== undefined && {
          defaultRetryDelay: retryConfig.retryDelay,
        }),
        defaultTTL: this.defaultTtl,
        ...(this.options.logger !== undefined && { logger: this.options.logger }),
      }

      this.lockManager = new LockManager(config)
    }
    catch (error) {
      throw new Error(
        `Failed to initialize RedlockService: ${error instanceof Error ? error.message : "Unknown error"}`,
        // { cause: error },
      )
    }
  }

  private getManager(): LockManager {
    if (!this.lockManager) {
      throw new Error(ERROR_MESSAGES.LOCK_MANAGER_NOT_INITIALIZED)
    }
    return this.lockManager
  }

  /**
   * Get retry configuration from module options
   */
  private getRetryConfig(): { retryAttempts?: number, retryDelay?: number } {
    return {
      ...(this.options.retryAttempts !== undefined && {
        retryAttempts: this.options.retryAttempts,
      }),
      ...(this.options.retryDelay !== undefined && {
        retryDelay: this.options.retryDelay,
      }),
    }
  }

  /**
   * Get or create a Lock instance for the given key and options.
   *
   * Memory optimization: Only locks with default options (TTL + retry config)
   * are cached to prevent unbounded Map growth. Custom options create locks on-demand.
   */
  private getLock(
    key: string,
    options: { ttl?: number, retryAttempts?: number, retryDelay?: number } = {},
  ): Lock {
    const manager = this.getManager()
    const effectiveTtl = options.ttl ?? this.defaultTtl
    const retryConfig = this.getRetryConfig()

    const lockOptions: {
      ttl: number
      retryAttempts?: number
      retryDelay?: number
    } = {
      ttl: effectiveTtl,
      ...(options.retryAttempts !== undefined || retryConfig.retryAttempts !== undefined
        ? { retryAttempts: options.retryAttempts ?? retryConfig.retryAttempts }
        : {}),
      ...(options.retryDelay !== undefined || retryConfig.retryDelay !== undefined
        ? { retryDelay: options.retryDelay ?? retryConfig.retryDelay }
        : {}),
    }

    const createLock = () =>
      this.options.nodes.length >= MIN_NODES_FOR_REDLOCK
        ? manager.createRedLock(key, lockOptions)
        : manager.createSimpleLock(key, lockOptions)

    // Only cache locks with default options to prevent memory leak
    const hasCustomOptions
      = options.ttl !== undefined
        || options.retryAttempts !== undefined
        || options.retryDelay !== undefined

    if (!hasCustomOptions) {
      const lockKey = `${key}:${this.defaultTtl}`
      if (!this.locks.has(lockKey)) {
        this.locks.set(lockKey, createLock())
      }
      // Map.get() after set() is guaranteed to return the value
      return this.locks.get(lockKey)!
    }

    // For custom options, create on-demand (no caching)
    return createLock()
  }

  /**
   * Acquire a distributed lock
   *
   * @param key - Lock key
   * @param ttl - Time-to-live in milliseconds (optional, defaults to module configuration)
   * @returns Lock handle that must be used to release the lock
   */
  async acquire(key: string, ttl?: number): Promise<LockHandle> {
    const lock = this.getLock(key, ttl !== undefined ? { ttl } : {})
    return lock.acquire()
  }

  /**
   * Release a distributed lock
   *
   * @param key - Lock key
   * @param handle - Lock handle from acquire()
   */
  async release(key: string, handle: LockHandle): Promise<void> {
    // Pass the TTL from handle to ensure we get the correct Lock instance
    const lock = this.getLock(key, { ttl: handle.ttl })
    await lock.release(handle)
  }

  /**
   * Execute a function with automatic lock acquisition and release
   *
   * Recommended method for most use cases. Handles lock lifecycle automatically.
   *
   * @param key - Lock key
   * @param fn - Function to execute while holding the lock
   * @param options - Lock options (ttl, retryAttempts, retryDelay)
   * @returns Result of the function
   */
  async using<T>(
    key: string,
    fn: (signal?: AbortSignal) => Promise<T>,
    options?: number | { ttl?: number, retryAttempts?: number, retryDelay?: number },
  ): Promise<T> {
    // Support both old signature (ttl as number) and new signature (options object)
    const lockOptions = typeof options === "number" ? { ttl: options } : options
    const lock = this.getLock(key, lockOptions)
    return lock.using(fn)
  }

  async onModuleDestroy(): Promise<void> {
    try {
      // Clear cached locks first
      this.locks.clear()

      // Disconnect all Redis adapters
      if (this.options.nodes?.length) {
        await Promise.allSettled(
          this.options.nodes.map(async (node) => {
            try {
              await node.disconnect()
            }
            catch (error) {
              // Log but don't throw - we want to try disconnecting all nodes

              console.error(`Failed to disconnect Redis adapter:`, error)
            }
          }),
        )
      }

      // Clear the manager reference (using type assertion for cleanup)
      this.lockManager = null as unknown as LockManager
    }
    catch (error) {
      // Log but don't throw during cleanup to prevent shutdown hangs

      console.error("Error during RedlockService cleanup:", error)
    }
  }
}
