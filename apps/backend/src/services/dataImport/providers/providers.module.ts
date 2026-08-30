import { DynamicModule, Module } from "@nestjs/common"
import { AsyncOpts, DataImportProvidersOptsSymbol, Opts } from "./constants"
import { DataImportProvidersService } from "./providers.service"

@Module({})
export class DataImportProvidersModule {
  static register(opts: Opts): DynamicModule {
    return {
      module: DataImportProvidersModule,
      providers: [
        {
          useValue: opts,
          provide: DataImportProvidersOptsSymbol,
        },
        DataImportProvidersService,
      ],
      exports: [DataImportProvidersService],
    }
  }

  static registerAsync(opts: AsyncOpts): DynamicModule {
    return {
      module: DataImportProvidersModule,
      providers: [
        ...(opts.providers ?? []),
        {
          useFactory: opts.useFactory,
          inject: opts.inject,
          provide: DataImportProvidersOptsSymbol,
        },
        DataImportProvidersService,
      ],
      exports: [DataImportProvidersService],
    }
  }
}
