import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { AuthProviderGuard } from './guards/provider.guard';
import { ProvidersService } from '@/routes/auth/providers/providers.service';
import { AllowedProvider } from '@/routes/auth/dto/allowedProvider';
import { SignUpDto } from '@/routes/auth/dto/signUp.dto';
import { SignInDto } from '@/routes/auth/dto/signIn.dto';
import { getUserWithoutPassword } from '@/shared/utils/getUserWithoutPassword';
import { User } from '@/routes/user/users.decorator';
import { UserDto } from '@/routes/auth/dto/user.dto';
import { ConfirmEmailDto } from '@/routes/auth/dto/confirmEmail.dto';
import { Throttle } from '@nestjs/throttler';
import { getMillisecondsFromMins } from '@/shared/utils/getMillisecondsFromMins';
import { GetRecoverPasswordEmailDto } from '@/routes/auth/dto/getRecoverPasswordEmail.dto';
import { ResetPasswordByTokenDto } from '@/routes/auth/dto/resetPasswordByToken.dto';

@Controller('auth')
export class AuthController {
  private async saveSession(req: Request) {
    return new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          return reject(
            new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR),
          );
        }
        resolve(true);
      });
    });
  }

  constructor(
    private readonly authService: AuthService,
    private readonly providersService: ProvidersService,
  ) {}

  @Post('/signUp')
  async signUp(@Req() req: Request, @Body() body: SignUpDto) {
    const user = await this.authService.signUp(body);

    req.session.user = getUserWithoutPassword(user);
    await this.saveSession(req);

    return;
  }

  @Post('/signIn')
  async signIn(@Req() req: Request, @Body() body: SignInDto, @User() currentUser: UserDto) {
    if (currentUser) {
      throw new HttpException('Already authenticated', HttpStatus.FORBIDDEN);
    }

    const user = await this.authService.signIn(body);

    req.session.user = getUserWithoutPassword(user);
    await this.saveSession(req);

    return;
  }

  @Throttle({
    default: {
      limit: 1,
      ttl: getMillisecondsFromMins(15),
    },
  })
  @Get('/confirmEmail')
  async getConfirmEmail(@User() user: UserDto) {
    return this.authService.sendConfirmationEmail(user.email);
  }

  @Throttle({
    default: {
      limit: 3,
      ttl: getMillisecondsFromMins(30),
    },
  })
  @Post('/recover-password')
  async getRecoverPasswordEmail(@Body() body: GetRecoverPasswordEmailDto) {
    return this.authService.sendPasswordRecoveryEmail(body.email);
  }

  @Post('/reset-password')
  async resetPasswordByToken(
    @Req() req: Request,
    @Body() body: ResetPasswordByTokenDto
  ) {
    const user = await this.authService.resetPasswordByToken(body.token, body.password)

    req.session.user = getUserWithoutPassword(user);
    await this.saveSession(req);

    return;
  }

  @Post('/confirmEmail')
  @UseGuards(AuthGuard)
  async confirmEmail(
    @Req() req: Request,
    @User() user: UserDto,
    @Body() body: ConfirmEmailDto,
  ) {
    await this.authService.confirmEmail(user.email, body.token);

    req.session.user.isEmailVerified = true;
    await this.saveSession(req);

    return;
  }

  @Get('/oauth/callback/:provider')
  @UseGuards(AuthProviderGuard)
  async callBack(
    @Req() req: Request,
    @Query('code') code: string,
    @Param('provider') provider: AllowedProvider,
  ) {
    if (!code) throw new HttpException('No code provided', HttpStatus.BAD_REQUEST);
    const user = await this.authService.extractProfileFromCode(provider, code);

    req.session.user = getUserWithoutPassword(user);
    await this.saveSession(req);

    return;
  }

  @Get('/oauth/connect/:provider')
  @UseGuards(AuthProviderGuard)
  async connect(@Param('provider') provider: AllowedProvider,) {
    const providerInstance = this.providersService.findService(provider);

    return {
      url: providerInstance.getAuthUrl(),
    };
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(
            new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR),
          );
        }
        resolve(true);
      });
    });
  }
}
