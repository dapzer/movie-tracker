import * as crypto from "node:crypto"
import { ConfirmEmailChangingEmail, WelcomeEmail } from "@movie-tracker/email-templates"
import ConfirmationEmail from "@movie-tracker/email-templates/dist/emails/confirmation-email"
import PasswordRecoveryEmail from "@movie-tracker/email-templates/dist/emails/password-recovery-email"
import { SignUpMethodEnum, UserType } from "@movie-tracker/types"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { render } from "@react-email/render"
import * as bcrypt from "bcrypt"
import { Cache } from "cache-manager"
import { AccountRepositoryInterface, AccountRepositorySymbol } from "@/repositories/account/AccountRepositoryInterface"
import {
  MediaListRepositoryInterface,
  MediaListRepositorySymbol,
} from "@/repositories/mediaList/MediaListRepositoryInterface"
import { UserRepositoryInterface, UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { AllowedProvider } from "@/routes/auth/dto/allowedProvider"
import { SignInDto } from "@/routes/auth/dto/signIn.dto"
import { SignUpDto } from "@/routes/auth/dto/signUp.dto"
import { ProvidersService } from "@/routes/auth/providers/providers.service"
import { MailService } from "@/services/mail/mail.service"
import { getMillisecondsFromDays } from "@/shared/utils/getMillisecondsFromDays"
import { getMillisecondsFromMins } from "@/shared/utils/getMillisecondsFromMins"

@Injectable()
export class AuthService {
  private saltRounds = Number(this.configService.get<number>("SALT_ROUNDS"))
  private readonly logger = new Logger("AuthService")

  private async createConfirmationToken(email: string) {
    const token = crypto.randomBytes(32).toString("hex")

    await this.cacheManager.set(
      `emailConfirmation:${email}:${Date.now()}`,
      token,
      getMillisecondsFromDays(1),
    )

    return token
  }

  private async getEmailConfirmationLink(email: string) {
    const token = await this.createConfirmationToken(email)

    return `${this.configService.get("CLIENT_BASE_URL")}/auth/confirm-email?token=${token}`
  }

  private async getKeysByPattern(pattern: string): Promise<string[]> {
    const storeIterator = this.cacheManager.stores[0]?.iterator
    if (storeIterator) {
      const result: string[] = []
      const prefix = pattern.replace(/\*.*$/, "")

      for await (const [key] of storeIterator({})) {
        if (key.startsWith(prefix)) {
          result.push(key)
        }
      }
      return result
    }
    return []
  }

  private async checkEmailConfirmation(email: string, token: string) {
    const storedTokensKeys = await this.getKeysByPattern(
      `emailConfirmation:${email}:*`,
    )

    if (!storedTokensKeys.length) {
      return false
    }

    const tokens = await this.cacheManager.mget<string>(storedTokensKeys)
    const isValid = tokens.includes(token)

    if (isValid) {
      await this.cacheManager.mdel(storedTokensKeys)
    }

    return isValid
  }

  private async sendWelcomeEmail(user: UserType) {
    const confirmationUrl = await this.getEmailConfirmationLink(user.email)
    try {
      const content = WelcomeEmail({
        url: confirmationUrl,
        username: user.name,
      })

      await this.mailService.send({
        to: user.email,
        subject: "Welcome to Movie Tracker!",
        html: render(content),
        text: render(content, { plainText: true }),
      })
    }
    catch (e) {
      this.logger.error(`Failed to send welcome email. ${e}`)
    }
  }

  private async getCacheRecordKeyByCryptedToken(key: string, token: string): Promise<string | null> {
    let recordKey: string | null = null

    const recoveryKeys = await this.getKeysByPattern(
      `${key}:*`,
    )

    for (const key of recoveryKeys) {
      const storedToken = key.split(":")[1]
      const value = await bcrypt.compare(token, storedToken)

      if (value) {
        recordKey = key
        break
      }
    }

    return recordKey
  }

  constructor(
    private readonly configService: ConfigService,
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
    const providerInstance = this.providersService.findService(provider)
    const profile = await providerInstance.getUserByCode(code)

    const account = await this.accountRepository.getByProvider({
      provider: profile.provider,
      providerAccountId: profile.id,
    })

    let user = null

    if (account) {
      user = await this.usersRepository.getById(account.userId)
    }
    else if (profile.email) {
      user = await this.usersRepository.getByEmail(profile.email)
    }

    if (user && account) {
      return user
    }

    if (!user) {
      const signUpMethod = SignUpMethodEnum[profile.provider.toUpperCase()]
      const isEmailVerified = [SignUpMethodEnum.YANDEX, SignUpMethodEnum.GOOGLE].includes(signUpMethod)

      user = await this.usersRepository.create({
        body: {
          email: profile.email,
          name: profile.name,
          image: profile.avatarUrl,
          isEmailVerified,
          signUpMethod,
        },
      })

      await this.mediaListRepository.create({
        userId: user.id,
        isSystem: true,
      })

      // if (user.email && !isEmailVerified) {
      //   await this.sendWelcomeEmail(user);
      // }
    }

    if (!account) {
      await this.accountRepository.create({
        userId: user.id,
        type: "oauth",
        provider: profile.provider,
        providerAccountId: profile.id,
        refresh_token: profile.refresh_token,
        access_token: profile.access_token,
        expires_at: profile.expires_at,
      })
    }

    return user
  }

  async signUp(body: SignUpDto) {
    const user = await this.usersRepository.getByEmail(body.email)

    if (user) {
      throw new HttpException("User already exists", HttpStatus.CONFLICT)
    }

    const passwordHash = await bcrypt.hash(body.password, this.saltRounds)

    const newUser = await this.usersRepository.create({
      body: {
        email: body.email,
        name: body.name,
        password: passwordHash,
        isEmailVerified: false,
        signUpMethod: SignUpMethodEnum.EMAIL,
      },
    })

    await this.mediaListRepository.create({
      userId: newUser.id,
      isSystem: true,
    })

    await this.sendWelcomeEmail(newUser)

    return newUser
  }

  async signIn(body: SignInDto) {
    const user = await this.usersRepository.getByEmail(body.email)

    if (!user) {
      throw new HttpException(
        "Email or password not valid",
        HttpStatus.BAD_REQUEST,
      )
    }

    if (!user.password) {
      throw new HttpException(
        "Email or password not valid",
        HttpStatus.BAD_REQUEST,
      )
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password)

    if (!passwordMatch) {
      throw new HttpException(
        "Email or password not valid",
        HttpStatus.BAD_REQUEST,
      )
    }

    return user
  }

  async sendConfirmationEmail(email: string) {
    const user = await this.usersRepository.getByEmail(email)

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }

    if (user.isEmailVerified) {
      throw new HttpException("Email already confirmed", HttpStatus.BAD_REQUEST)
    }
    const confirmationUrl = await this.getEmailConfirmationLink(user.email)

    try {
      const content = ConfirmationEmail({
        url: confirmationUrl,
        username: user.name,
      })
      await this.mailService.send({
        to: user.email,
        subject: "Email confirmation",
        html: render(content),
        text: render(content, { plainText: true },
        ),
      })
    }
    catch {
      throw new HttpException("Failed to send an email", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async requestChangeEmail(id: string, email: string) {
    const user = await this.usersRepository.getById(id)

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }

    const userByEmail = await this.usersRepository.getByEmail(email)

    if (userByEmail || user.email === email) {
      throw new HttpException("Email already in use", HttpStatus.BAD_REQUEST)
    }

    if (user.isEmailVerified) {
      throw new HttpException("Email already confirmed", HttpStatus.BAD_REQUEST)
    }

    const token = crypto.randomBytes(32).toString("hex")
    const hashedToken = await bcrypt.hash(token, this.saltRounds)

    await this.cacheManager.set(`changeEmail:${hashedToken}`, {
      userId: user.id,
      email,
    }, getMillisecondsFromMins(15))

    const confirmationUrl = `${this.configService.get("CLIENT_BASE_URL")}/auth/change-email?token=${token}`

    try {
      const content = ConfirmEmailChangingEmail({
        url: confirmationUrl,
        email: user.email,
        username: user.name,
      })

      await this.mailService.send({
        to: email,
        subject: "Email changing",
        html: render(content),
        text: render(content, { plainText: true },
        ),
      })
    }
    catch {
      throw new HttpException("Failed to send an email", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async confirmEmailChanging(token: string) {
    const recordKey = await this.getCacheRecordKeyByCryptedToken("changeEmail", token)

    if (!recordKey) {
      throw new HttpException("Invalid token", HttpStatus.BAD_REQUEST)
    }

    const { userId, email } = await this.cacheManager.get<{ userId: string, email: string }>(recordKey)

    if (!userId || !email) {
      throw new HttpException("Invalid token", HttpStatus.BAD_REQUEST)
    }

    const user = await this.usersRepository.update({
      id: userId,
      body: {
        email,
        isEmailVerified: true,
      },
    })

    await this.cacheManager.del(recordKey)

    return user
  }

  async confirmEmail(email: string, token: string) {
    const user = await this.usersRepository.getByEmail(email)

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }

    if (user.isEmailVerified) {
      throw new HttpException("Email already confirmed", HttpStatus.BAD_REQUEST)
    }

    const isTokenValid = await this.checkEmailConfirmation(email, token)

    if (!isTokenValid) {
      throw new HttpException("Invalid token", HttpStatus.BAD_REQUEST)
    }

    await this.usersRepository.update({
      id: user.id,
      body: {
        isEmailVerified: true,
      },
    })
  }

  async sendPasswordRecoveryEmail(email: string) {
    const user = await this.usersRepository.getByEmail(email)

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }

    const token = crypto.randomBytes(32).toString("hex")
    const hashedToken = await bcrypt.hash(token, this.saltRounds)

    await this.cacheManager.set(
      `passwordRecover:${hashedToken}`,
      user.id,
      getMillisecondsFromMins(15),
    )

    try {
      const url = `${this.configService.get("CLIENT_BASE_URL")}/reset-password?token=${token}`
      const content = PasswordRecoveryEmail({
        url,
      })
      await this.mailService.send({
        to: user.email,
        subject: "Password recovery",
        html: render(content),
        text: render(content, { plainText: true },
        ),
      })
    }
    catch {
      throw new HttpException("Failed to send an email", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async resetPasswordByToken(token: string, password: string) {
    if (!token) {
      throw new HttpException("No token provided", HttpStatus.BAD_REQUEST)
    }

    const recordKey = await this.getCacheRecordKeyByCryptedToken(
      `passwordRecover`,
      token,
    )

    if (!recordKey) {
      throw new HttpException("Invalid token", HttpStatus.BAD_REQUEST)
    }

    const userId = await this.cacheManager.get(recordKey)

    if (!userId) {
      throw new HttpException("Invalid token", HttpStatus.BAD_REQUEST)
    }

    const user = await this.usersRepository.getById(userId as string)

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }

    const passwordHash = await bcrypt.hash(password, this.saltRounds)

    await this.usersRepository.update({
      id: user.id,
      body: {
        password: passwordHash,
      },
    })

    await this.cacheManager.del(recordKey)

    return user
  }
}
