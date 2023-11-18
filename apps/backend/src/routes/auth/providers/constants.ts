import { BaseService } from './services/base';
import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

export const ProvidersOptsSymbol = Symbol();

export type Opts = {
  baseUrl: string;
  services: BaseService[];
};

export type AsyncOpts = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<Opts>, 'useFactory' | 'inject'>;
