import { AccountRepositorySymbol } from "@/repositories/account/AccountRepositoryInterface"
import { PrismaAccountRepository } from "@/repositories/account/PrismaAccountRepository"
import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { PrismaMediaListRepository } from "@/repositories/mediaList/PrismaMediaListRepository"
import { PrismaUserRepository } from "@/repositories/user/PrismaUserRepository"
import { UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { ProvidersModule } from "@/routes/auth/providers/providers.module"
import { GithubProvider } from "@/routes/auth/providers/services/githubProvider"
import { GoogleProvider } from "@/routes/auth/providers/services/googleProvider"
import { VkProvider } from "@/routes/auth/providers/services/vkProvider"
import { YandexProvider } from "@/routes/auth/providers/services/yandexProvider"
import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { AuthProviderGuard } from "./guards/provider.guard"

@Module({
  imports: [
    ProvidersModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          baseUrl: configService.get("AUTH_REDIRECT_URL")!,
          services: [
            new GithubProvider({
              client_id: configService.get("GITHUB_CLIENT_ID")!,
              client_secret: configService.get("GITHUB_CLIENT_SECRET")!,
              scopes: ["read:user", "user:email"],
            }),
            new GoogleProvider({
              client_id: configService.get("GOOGLE_CLIENT_ID")!,
              client_secret: configService.get("GOOGLE_CLIENT_SECRET")!,
              scopes: ["profile", "email"],
            }),
            new YandexProvider({
              client_id: configService.get("YANDEX_CLIENT_ID")!,
              client_secret: configService.get("YANDEX_CLIENT_SECRET")!,
              scopes: ["login:email", "login:avatar", "login:info"],
            }),
            new VkProvider({
              client_id: configService.get("VK_CLIENT_ID")!,
              client_secret: configService.get("VK_CLIENT_SECRET")!,
              scopes: ["email"],
            }),
          ],
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    AuthProviderGuard,
    {
      provide: UserRepositorySymbol,
      useClass: PrismaUserRepository,
    },
    {
      provide: AccountRepositorySymbol,
      useClass: PrismaAccountRepository,
    },
    {
      provide: MediaListRepositorySymbol,
      useClass: PrismaMediaListRepository,
    },
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
