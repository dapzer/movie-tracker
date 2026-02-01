import type { ModuleMetadata, Type } from "@nestjs/common"
import type { ILogger, RedisAdapter } from "redlock-universal"

/**
 * Configuration options for RedlockModule
 */
export interface RedlockModuleOptions {
  /**
   * Redis adapter instances from redlock-universal
   * Use NodeRedisAdapter or IoredisAdapter depending on your Redis client
   */
  readonly nodes: readonly RedisAdapter[]

  /**
   * Minimum number of nodes that must acquire the lock
   * @default Math.ceil(nodes.length / 2)
   */
  readonly quorum?: number

  /**
   * Number of retry attempts for lock acquisition
   * @default DEFAULT_RETRY_ATTEMPTS (3)
   */
  readonly retryAttempts?: number

  /**
   * Delay between retry attempts in milliseconds
   * @default DEFAULT_RETRY_DELAY_MS (200ms)
   */
  readonly retryDelay?: number

  /**
   * Default TTL for locks in milliseconds
   * @default DEFAULT_TTL_MS (30000ms / 30 seconds)
   */
  readonly defaultTtl?: number

  /**
   * Optional logger instance for lock operations
   * Supports Winston, Pino (via createPinoAdapter), and Bunyan (via createBunyanAdapter)
   */
  readonly logger?: ILogger
}

/**
 * Factory interface for async module configuration
 */
export interface RedlockOptionsFactory {
  createRedlockOptions: () => Promise<RedlockModuleOptions> | RedlockModuleOptions
}

/**
 * Async module configuration options
 */
export interface RedlockModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  /**
   * Use existing provider
   */
  useExisting?: Type<RedlockOptionsFactory>

  /**
   * Use class provider
   */
  useClass?: Type<RedlockOptionsFactory>

  /**
   * Use factory function
   */
  useFactory?: (...args: any[]) => Promise<RedlockModuleOptions> | RedlockModuleOptions

  /**
   * Dependencies to inject into factory
   */
  inject?: any[]
}
