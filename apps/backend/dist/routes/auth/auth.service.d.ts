import { ConfigService } from '@nestjs/config';
import { ProvidersService } from '@/routes/auth/providers/providers.service';
import { AllowedProvider } from '@/routes/auth/dto/allowedProvider';
import { UserRepositoryInterface } from '@/repositories/user/UserRepositoryInterface';
import { AccountRepositoryInterface } from '@/repositories/account/AccountRepositoryInterface';
import { MediaListRepositoryInterface } from '@/repositories/mediaList/MediaListRepositoryInterface';
export declare class AuthService {
    private readonly config;
    private readonly providersService;
    private readonly usersRepository;
    private readonly accountRepository;
    private readonly mediaListRepository;
    constructor(config: ConfigService, providersService: ProvidersService, usersRepository: UserRepositoryInterface, accountRepository: AccountRepositoryInterface, mediaListRepository: MediaListRepositoryInterface);
    extractProfileFromCode(provider: AllowedProvider, code: string): Promise<import("./dto/user.dto").UserDto>;
}
