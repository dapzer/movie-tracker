import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ProvidersService } from '@/routes/auth/providers/providers.service';
export declare class AuthProviderGuard implements CanActivate {
    private readonly providersService;
    constructor(providersService: ProvidersService);
    canActivate(context: ExecutionContext): boolean;
}
