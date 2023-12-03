import {
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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly providersService: ProvidersService,
  ) {}

  @Get('/callback/:provider')
  @UseGuards(AuthProviderGuard)
  async callBack(
    @Req() req: Request,
    @Query('code') code: string,
    @Param('provider') provider: AllowedProvider,
  ) {
    if (!code) throw new HttpException('No code provided', 400);

    req.session.user = await this.authService.extractProfileFromCode(
      provider,
      code,
    );

    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          return reject(
            new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR),
          );
        }
        resolve(true);
      });
    });

    return;
  }

  @Get(['/connect/:provider', '/login/:provider'])
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
