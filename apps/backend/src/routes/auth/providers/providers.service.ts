import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Opts, ProvidersOptsSymbol } from './constants';
import { BaseService } from './services/base';

@Injectable()
export class ProvidersService implements OnModuleInit {
  constructor(@Inject(ProvidersOptsSymbol) private readonly opts: Opts) {}

  onModuleInit() {
    for (const provider of this.opts.services) {
      provider.baseUrl = this.opts.baseUrl;
    }
  }

  findService(service: string): BaseService | null {
    return this.opts.services.find((s) => s.name === service) ?? null;
  }
}
