import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProvidersService } from '@/routes/auth/providers/providers.service';
import { AllowedProvider } from '@/routes/auth/dto/allowedProvider';
import {
  UserRepositoryInterface,
  UserRepositorySymbol,
} from '@/repositories/user/UserRepositoryInterface';
import {
  AccountRepositoryInterface,
  AccountRepositorySymbol,
} from '@/repositories/account/AccountRepositoryInterface';
import {
  MediaListRepositoryInterface,
  MediaListRepositorySymbol,
} from '@/repositories/mediaList/MediaListRepositoryInterface';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly providersService: ProvidersService,
    @Inject(UserRepositorySymbol)
    private readonly usersRepository: UserRepositoryInterface,
    @Inject(AccountRepositorySymbol)
    private readonly accountRepository: AccountRepositoryInterface,
    @Inject(MediaListRepositorySymbol)
    private readonly mediaListRepository: MediaListRepositoryInterface,
  ) {}

  async extractProfileFromCode(provider: AllowedProvider, code: string) {
    const providerInstance = this.providersService.findService(provider);
    const profile = await providerInstance.getUserByCode(code);

    const account = await this.accountRepository.getAccountByProvider(
      profile.provider,
      profile.id,
    );

    let user = account?.userId
      ? await this.usersRepository.getUserById(account?.userId)
      : null;

    if (user) {
      user = await this.usersRepository.updateUser(user.id, {
        name: profile.name,
        image: profile.avatarUrl,
      });
    } else {
      user = await this.usersRepository.createUser({
        email: profile.email,
        name: profile.name,
        image: profile.avatarUrl,
      });

      await this.mediaListRepository.createMediaList(user.id, true);
    }

    if (!account) {
      await this.accountRepository.createAccount({
        userId: user.id,
        type: 'oauth',
        provider: profile.provider,
        providerAccountId: profile.id,
        refresh_token: profile.refresh_token,
        access_token: profile.access_token,
        expires_at: profile.expires_at,
      });
    }

    return user;
  }
}
