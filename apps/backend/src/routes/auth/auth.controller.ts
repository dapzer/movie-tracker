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
  async signIn(@Req() req: Request, @Body() body: SignInDto) {
    const user = await this.authService.signIn(body);

    req.session.user = getUserWithoutPassword(user);
    await this.saveSession(req);

    return;
  }

  @Get('/callback/:provider')
  @UseGuards(AuthProviderGuard)
  async callBack(
    @Req() req: Request,
    @Query('code') code: string,
    @Param('provider') provider: AllowedProvider,
  ) {
    if (!code) throw new HttpException('No code provided', 400);
    const user = await this.authService.extractProfileFromCode(provider, code);

    req.session.user = getUserWithoutPassword(user);
    await this.saveSession(req);

    return;
  }

  @Get('/connect/:provider')
  @UseGuards(AuthProviderGuard)
  async connect(
    @Req() req: Request,
    @Param('provider') provider: AllowedProvider,
  ) {
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
