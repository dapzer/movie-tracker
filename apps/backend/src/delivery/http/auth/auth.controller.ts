import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Throttle } from "@nestjs/throttler"
import { Request, Response } from "express"
import { AuthService } from "@/services/auth/auth.service"
import { AllowedProvider } from "@/services/auth/dto/allowedProvider"
import { ConfirmChangeEmailDto } from "@/services/auth/dto/confirmChangeEmail.dto"
import { ConfirmEmailDto } from "@/services/auth/dto/confirmEmail.dto"
import { GetRecoverPasswordEmailDto } from "@/services/auth/dto/getRecoverPasswordEmail.dto"
import { RequestChangeEmailDto } from "@/services/auth/dto/requestChangeEmail.dto"
import { ResetPasswordByTokenDto } from "@/services/auth/dto/resetPasswordByToken.dto"
import { SignInDto } from "@/services/auth/dto/signIn.dto"
import { SignUpDto } from "@/services/auth/dto/signUp.dto"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { AuthProviderGuard } from "@/services/auth/guards/provider.guard"
import { ProvidersService } from "@/services/auth/providers/providers.service"
import { UserDto } from "@/services/users/dto/user.dto"
import { User } from "@/services/users/user.decorator"
import { AlreadyAuthenticatedError, NoCodeProvidedError, SessionError } from "@/shared/errors/auth"
import { getMillisecondsFromHours } from "@/shared/utils/getMillisecondsFromHours"
import { getMillisecondsFromMins } from "@/shared/utils/getMillisecondsFromMins"
import { getUserWithoutPassword } from "@/shared/utils/getUserWithoutPassword"
import {
  AuthControllerDocs,
  ConfirmChangeEmailDocs,
  ConfirmEmailDocs,
  LogoutDocs,
  OAuthCallbackDocs,
  OAuthConnectDocs,
  RecoverPasswordDocs,
  RequestChangeEmailDocs,
  ResetPasswordDocs,
  SendConfirmEmailDocs,
  SignInDocs,
  SignUpDocs,
} from "./auth.controller.docs"

@AuthControllerDocs()
@Controller("auth")
export class AuthController {
  private async saveSession(req: Request) {
    return new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          return reject(
            new SessionError({ message: err.message, cause: err }),
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
  @SignUpDocs()
  async signUp(@Req() req: Request, @Body() body: SignUpDto) {
    const user = await this.authService.signUp(body)

    req.session.user = getUserWithoutPassword(user)
    await this.saveSession(req)
  }

  @Post("/sign-in")
  @SignInDocs()
  async signIn(@Req() req: Request, @Body() body: SignInDto, @User() currentUser: UserDto) {
    if (currentUser) {
      throw new AlreadyAuthenticatedError()
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
  @RecoverPasswordDocs()
  async getRecoverPasswordEmail(@Body() body: GetRecoverPasswordEmailDto) {
    return this.authService.sendPasswordRecoveryEmail(body.email)
  }

  @Post("/reset-password")
  @ResetPasswordDocs()
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
  @RequestChangeEmailDocs()
  async requestChangeEmail(@User() user: UserDto, @Body() body: RequestChangeEmailDto) {
    return this.authService.requestChangeEmail(user.id, body.email)
  }

  @Patch("/change-email")
  @ConfirmChangeEmailDocs()
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
  @SendConfirmEmailDocs()
  @UseGuards(AuthGuard)
  async getConfirmEmail(@User() user: UserDto) {
    return this.authService.sendConfirmationEmail(user.email)
  }

  @Patch("/confirm-email")
  @ConfirmEmailDocs()
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
  @OAuthCallbackDocs()
  @UseGuards(AuthProviderGuard)
  async callBack(
    @Req() req: Request,
    @Query("code") code: string,
    @Param("provider") provider: AllowedProvider,
  ) {
    if (!code)
      throw new NoCodeProvidedError()
    const user = await this.authService.extractProfileFromCode(provider, code)

    req.session.user = getUserWithoutPassword(user)
    await this.saveSession(req)
  }

  @Get("/oauth/connect/:provider")
  @OAuthConnectDocs()
  @UseGuards(AuthProviderGuard)
  async connect(@Param("provider") provider: AllowedProvider) {
    const providerInstance = this.providersService.findService(provider)

    return {
      url: providerInstance.getAuthUrl(),
    }
  }

  @Post("/logout")
  @LogoutDocs()
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(
            new SessionError({ message: err?.message, cause: err }),
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
