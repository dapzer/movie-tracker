import { DynamicModule } from '@nestjs/common';
import { AsyncOpts, Opts } from './constants';
export declare class ProvidersModule {
    static register(opts: Opts): DynamicModule;
    static registerAsync(opts: AsyncOpts): DynamicModule;
}
