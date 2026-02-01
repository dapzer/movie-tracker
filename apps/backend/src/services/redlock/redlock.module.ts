import type {
  RedlockModuleAsyncOptions,
  RedlockModuleOptions,
  RedlockOptionsFactory,
} from "./types/redlockModuleOptions.type"
import { DynamicModule, Global, Module, Provider } from "@nestjs/common"
import { ERROR_MESSAGES, REDLOCK_MODULE_OPTIONS } from "./constants"
import { RedlockService } from "./redlock.service"

/**
 * Module for distributed lock management using redlock-universal
 *
 * @example
 * ```typescript
 * import { createClient } from 'redis';
 * import { NodeRedisAdapter } from 'redlock-universal';
 *
 * // Synchronous configuration
 * @Module({
 *   imports: [
 *     RedlockModule.forRoot({
 *       nodes: [
 *         new NodeRedisAdapter(await createClient({ url: 'redis://localhost:6379' }).connect()),
 *         new NodeRedisAdapter(await createClient({ url: 'redis://localhost:6380' }).connect()),
 *         new NodeRedisAdapter(await createClient({ url: 'redis://localhost:6381' }).connect()),
 *       ],
 *       defaultTtl: 30000,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 *
 * // Asynchronous configuration
 * @Module({
 *   imports: [
 *     RedlockModule.forRootAsync({
 *       useFactory: async (configService: ConfigService) => {
 *         const redisUrls = configService.get<string[]>('redis.urls');
 *         const clients = await Promise.all(
 *           redisUrls.map(url => createClient({ url }).connect())
 *         );
 *         return {
 *           nodes: clients.map(client => new NodeRedisAdapter(client)),
 *           defaultTtl: 30000,
 *         };
 *       },
 *       inject: [ConfigService],
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
@Global()
@Module({})
export class RedlockModule {
  static forRoot(options: RedlockModuleOptions): DynamicModule {
    return {
      module: RedlockModule,
      providers: [
        {
          provide: REDLOCK_MODULE_OPTIONS,
          useValue: options,
        },
        RedlockService,
      ],
      exports: [RedlockService],
    }
  }

  static forRootAsync(options: RedlockModuleAsyncOptions): DynamicModule {
    return {
      module: RedlockModule,
      imports: options.imports || [],
      providers: [...this.createAsyncProviders(options), RedlockService],
      exports: [RedlockService],
    }
  }

  private static createAsyncProviders(options: RedlockModuleAsyncOptions): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: REDLOCK_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        } as Provider,
      ]
    }

    const useClass = options.useClass || options.useExisting

    if (!useClass) {
      throw new Error(ERROR_MESSAGES.INVALID_ASYNC_OPTIONS)
    }

    return [
      {
        provide: REDLOCK_MODULE_OPTIONS,
        useFactory: async (optionsFactory: RedlockOptionsFactory) =>
          optionsFactory.createRedlockOptions(),
        inject: [useClass],
      },
      {
        provide: useClass,
        useClass,
      },
    ]
  }
}
