import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
import * as bcrypt from 'bcrypt';
import { SignUpDto } from '@/routes/auth/dto/signUp.dto';
import { SignInDto } from '@/routes/auth/dto/signIn.dto';

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

    if (user && account) {
      return this.usersRepository.updateUser(user.id, {
        name: profile.name,
        image: profile.avatarUrl,
      });
    }

    if (!user) {
      user = await this.usersRepository.createUser({
        email: profile.email,
        name: profile.name,
        image: profile.avatarUrl,
        isEmailVerified: true,
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

  async signUp(body: SignUpDto) {
    const user = await this.usersRepository.getUserByEmail(body.email);

    if (user) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    return this.usersRepository.createUser({
      email: body.email,
      name: body.name,
      image: body.image,
      password: passwordHash,
      isEmailVerified: false,
    });
  }

  async signIn(body: SignInDto) {
    const user = await this.usersRepository.getUserByEmail(body.email);

    if (!user) {
      throw new HttpException(
        'Email or password not valid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password);

    if (!passwordMatch) {
      throw new HttpException(
        'Email or password not valid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
