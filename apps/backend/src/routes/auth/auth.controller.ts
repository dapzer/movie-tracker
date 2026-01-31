import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Throttle } from "@nestjs/throttler"
import { Request, Response } from "express"
import { AllowedProvider } from "@/routes/auth/dto/allowedProvider"
import { ConfirmChangeEmailDto } from "@/routes/auth/dto/confirmChangeEmail.dto"
import { ConfirmEmailDto } from "@/routes/auth/dto/confirmEmail.dto"
import { GetRecoverPasswordEmailDto } from "@/routes/auth/dto/getRecoverPasswordEmail.dto"
import { RequestChangeEmailDto } from "@/routes/auth/dto/requestChangeEmail.dto"
import { ResetPasswordByTokenDto } from "@/routes/auth/dto/resetPasswordByToken.dto"
import { SignInDto } from "@/routes/auth/dto/signIn.dto"
import { SignUpDto } from "@/routes/auth/dto/signUp.dto"
import { UserDto } from "@/routes/auth/dto/user.dto"
import { ProvidersService } from "@/routes/auth/providers/providers.service"
import { User } from "@/routes/user/users.decorator"
import { getMillisecondsFromHours } from "@/shared/utils/getMillisecondsFromHours"
import { getMillisecondsFromMins } from "@/shared/utils/getMillisecondsFromMins"
import { getUserWithoutPassword } from "@/shared/utils/getUserWithoutPassword"
import { AuthService } from "./auth.service"
import { AuthGuard } from "./guards/auth.guard"
import { AuthProviderGuard } from "./guards/provider.guard"

@Controller("auth")
export class AuthController {
  private async saveSession(req: Request) {
    return new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          return reject(
            new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR),
          )
        }
        resolve(true)
      })
    })
  }

  constructor(
    private readonly authService: AuthService,
    private readonly providersService: ProvidersService,
    private readonly configService: ConfigService,
  ) {
  }

  @Post("/sign-up")
  async signUp(@Req() req: Request, @Body() body: SignUpDto) {
    const user = await this.authService.signUp(body)

    req.session.user = getUserWithoutPassword(user)
    await this.saveSession(req)
  }

  @Post("/sign-in")
  async signIn(@Req() req: Request, @Body() body: SignInDto, @User() currentUser: UserDto) {
    if (currentUser) {
      throw new HttpException("Already authenticated", HttpStatus.FORBIDDEN)
    }

    const user = await this.authService.signIn(body)

    req.session.user = getUserWithoutPassword(user)
    await this.saveSession(req)
  }

  @Throttle({
    default: {
      limit: 3,
      ttl: getMillisecondsFromMins(30),
    },
  })
  @Post("/recover-password")
  async getRecoverPasswordEmail(@Body() body: GetRecoverPasswordEmailDto) {
    return this.authService.sendPasswordRecoveryEmail(body.email)
  }

  @Post("/reset-password")
  async resetPasswordByToken(
    @Req() req: Request,
    @Body() body: ResetPasswordByTokenDto,
  ) {
    const user = await this.authService.resetPasswordByToken(body.token, body.password)

    req.session.user = getUserWithoutPassword(user)
    await this.saveSession(req)
  }

  @Throttle({
    default: {
      limit: 3,
      ttl: getMillisecondsFromHours(12),
    },
  })
  @UseGuards(AuthGuard)
  @Post("/change-email")
  async requestChangeEmail(@User() user: UserDto, @Body() body: RequestChangeEmailDto) {
    return this.authService.requestChangeEmail(user.id, body.email)
  }

  @Patch("/change-email")
  @UseGuards(AuthGuard)
  async confirmEmailChanging(@Req() req: Request, @User() user: UserDto, @Body() body: ConfirmChangeEmailDto) {
    const updatedUser = await this.authService.confirmEmailChanging(body.token)

    req.session.user = getUserWithoutPassword(updatedUser)
    await this.saveSession(req)
  }

  @Throttle({
    default: {
      limit: 1,
      ttl: getMillisecondsFromMins(15),
    },
  })
  @Get("/confirm-email")
  @UseGuards(AuthGuard)
  async getConfirmEmail(@User() user: UserDto) {
    return this.authService.sendConfirmationEmail(user.email)
  }

  @Patch("/confirm-email")
  @UseGuards(AuthGuard)
  async confirmEmail(
    @Req() req: Request,
    @User() user: UserDto,
    @Body() body: ConfirmEmailDto,
  ) {
    await this.authService.confirmEmail(user.email, body.token)

    req.session.user.isEmailVerified = true
    await this.saveSession(req)
  }

  @Get("/oauth/callback/:provider")
  @UseGuards(AuthProviderGuard)
  async callBack(
    @Req() req: Request,
    @Query("code") code: string,
    @Param("provider") provider: AllowedProvider,
  ) {
    if (!code)
      throw new HttpException("No code provided", HttpStatus.BAD_REQUEST)
    const user = await this.authService.extractProfileFromCode(provider, code)

    req.session.user = getUserWithoutPassword(user)
    await this.saveSession(req)
  }

  @Get("/oauth/connect/:provider")
  @UseGuards(AuthProviderGuard)
  async connect(@Param("provider") provider: AllowedProvider) {
    const providerInstance = this.providersService.findService(provider)

    return {
      url: providerInstance.getAuthUrl(),
    }
  }

  @Post("/logout")
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(
            new HttpException(err?.message, HttpStatus.INTERNAL_SERVER_ERROR),
          )
        }
        resolve(true)
      })
    }).then(() => {
      res.clearCookie("session", {
        sameSite: true,
        httpOnly: true,
        domain: `.${new URL(this.configService.get("CLIENT_BASE_URL")).hostname}`,
      })
      res.send(true)
    }).catch(() => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Error while destroying session",
      })
    })
  }
}
