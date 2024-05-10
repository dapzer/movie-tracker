import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProvidersService } from '@/routes/auth/providers/providers.service';
import { AllowedProvider } from '@/routes/auth/dto/allowedProvider';
import { UserRepositoryInterface, UserRepositorySymbol } from '@/repositories/user/UserRepositoryInterface';
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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import { getMillisecondsFromDays } from '@/shared/utils/getMillisecondsFromDays';
import { MailService } from '@/services/mail/mail.service';
import { render } from '@react-email/render';
import { WelcomeEmail } from '@movie-tracker/email-templates';
import ConfirmationEmail from '@movie-tracker/email-templates/dist/emails/confirmation-email';
import { SignUpMethodEnum, UserType } from '@movie-tracker/types';

@Injectable()
export class AuthService {
  private async createConfirmationToken(email: string) {
    const token = crypto.randomBytes(32).toString('hex');

    await this.cacheManager.set(
      `emailConfirmation:${email}:${Date.now()}`,
      token,
      getMillisecondsFromDays(1),
    );

    return token;
  }

  private async getEmailConfirmationLink(email: string) {
    const token = await this.createConfirmationToken(email);

    return `${this.config.get('CLIENT_BASE_URL')}/auth/confirmEmail?token=${token}`;
  }

  private async checkEmailConfirmation(email: string, token: string) {
    const storedTokensKeys = await this.cacheManager.store.keys(
      `emailConfirmation:${email}:*`,
    );

    if (!storedTokensKeys.length) {
      return false;
    }

    const tokens = await this.cacheManager.store.mget(...storedTokensKeys);

    const isValid = tokens.includes(token);

    if (isValid) {
      await this.cacheManager.store.mdel(...storedTokensKeys);
    }

    return isValid;
  }

  private async sendWelcomeEmail(user: UserType) {
    const confirmationUrl = await this.getEmailConfirmationLink(user.email);

    return this.mailService.send({
      to: user.email,
      subject: 'Welcome to Movie Tracker!',
      html: render(
        WelcomeEmail({
          url: confirmationUrl,
          username: user.name,
        }),
      ),
      text: render(
        WelcomeEmail({
          url: confirmationUrl,
          username: user.name,
        }),
        { plainText: true },
      ),
    });
  }

  constructor(
    private readonly config: ConfigService,
    private readonly mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly providersService: ProvidersService,
    @Inject(UserRepositorySymbol)
    private readonly usersRepository: UserRepositoryInterface,
    @Inject(AccountRepositorySymbol)
    private readonly accountRepository: AccountRepositoryInterface,
    @Inject(MediaListRepositorySymbol)
    private readonly mediaListRepository: MediaListRepositoryInterface,
  ) {
  }

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
        isEmailVerified: false,
        signUpMethod: SignUpMethodEnum[profile.provider.toUpperCase()],
      });

      await this.mediaListRepository.createMediaList(user.id, true);

      if (user.email) {
        await this.sendWelcomeEmail(user);
      }
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

    const newUser = await this.usersRepository.createUser({
      email: body.email,
      name: body.name,
      image: body.image,
      password: passwordHash,
      isEmailVerified: false,
      signUpMethod: SignUpMethodEnum.EMAIL,
    });

    await this.mediaListRepository.createMediaList(newUser.id, true);

    await this.sendWelcomeEmail(newUser);

    return newUser;
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

  async requestEmailConfirmation(email: string) {
    const user = await this.usersRepository.getUserByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.isEmailVerified) {
      throw new HttpException('Email already confirmed', HttpStatus.BAD_REQUEST);
    }

    const confirmationUrl = await this.getEmailConfirmationLink(user.email);

    await this.mailService.send({
      to: user.email,
      subject: 'Email confirmation',
      html: render(
        ConfirmationEmail({
          url: confirmationUrl,
          username: user.name,
        }),
      ),
      text: render(
        ConfirmationEmail({
          url: confirmationUrl,
          username: user.name,
        }),
        { plainText: true },
      ),
    });

    return;
  }

  async confirmEmail(email: string, token: string) {
    const isTokenValid = await this.checkEmailConfirmation(email, token);

    if (!isTokenValid) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersRepository.getUserByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.isEmailVerified) {
      throw new HttpException('Email already confirmed', HttpStatus.BAD_REQUEST);
    }

    await this.usersRepository.updateUser(user.id, {
      isEmailVerified: true,
    });

    return;
  }
}
