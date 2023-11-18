import { AuthService } from './auth.service';
import { Request } from 'express';
import { ProvidersService } from '@/routes/auth/providers/providers.service';
import { AllowedProvider } from '@/routes/auth/dto/allowedProvider';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly providersService;
    private readonly configService;
    constructor(authService: AuthService, providersService: ProvidersService, configService: ConfigService);
    callBack(req: Request, code: string, provider: AllowedProvider): Promise<{
        url: any;
    }>;
    connect(req: Request, provider: AllowedProvider): Promise<{
        url: string;
    }>;
    logout(req: Request): Promise<unknown>;
}
