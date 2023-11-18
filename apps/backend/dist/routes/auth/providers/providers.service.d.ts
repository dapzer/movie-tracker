import { OnModuleInit } from '@nestjs/common';
import { Opts } from './constants';
import { BaseService } from './services/base';
export declare class ProvidersService implements OnModuleInit {
    private readonly opts;
    constructor(opts: Opts);
    onModuleInit(): void;
    findService(service: string): BaseService | null;
}
