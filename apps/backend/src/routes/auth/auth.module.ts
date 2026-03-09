import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { AccountRepositorySymbol } from "@/repositories/account/AccountRepositoryInterface"
import { DrizzleAccountRepository } from "@/repositories/account/DrizzleAccountRepository"
import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { DrizzleMediaListRepository } from "@/repositories/mediaList/DrizzleMediaListRepository"
import { DrizzleUserRepository } from "@/repositories/user/DrizzleUserRepository"
import { UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { ProvidersModule } from "@/routes/auth/providers/providers.module"
import { GithubProvider } from "@/routes/auth/providers/services/githubProvider"
import { GoogleProvider } from "@/routes/auth/providers/services/googleProvider"
import { VkProvider } from "@/routes/auth/providers/services/vkProvider"
import { YandexProvider } from "@/routes/auth/providers/services/yandexProvider"
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
      useClass: DrizzleUserRepository,
    },
    {
      provide: AccountRepositorySymbol,
      useClass: DrizzleAccountRepository,
    },
    {
      provide: MediaListRepositorySymbol,
      useClass: DrizzleMediaListRepository,
    },
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
