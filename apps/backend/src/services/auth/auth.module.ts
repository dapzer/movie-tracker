import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { AccountRepositorySymbol } from "@/repositories/account/AccountRepositoryInterface"
import { DrizzleAccountRepository } from "@/repositories/account/DrizzleAccountRepository"
import { DrizzleMediaListRepository } from "@/repositories/mediaList/DrizzleMediaListRepository"
import { MediaListRepositorySymbol } from "@/repositories/mediaList/MediaListRepositoryInterface"
import { DrizzleUserRepository } from "@/repositories/user/DrizzleUserRepository"
import { UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { AuthService } from "@/services/auth/auth.service"
import { AuthProviderGuard } from "@/services/auth/guards/provider.guard"
import { ProvidersModule } from "@/services/auth/providers/providers.module"
import { GithubProvider } from "@/services/auth/providers/services/githubProvider"
import { GoogleProvider } from "@/services/auth/providers/services/googleProvider"
import { VkProvider } from "@/services/auth/providers/services/vkProvider"
import { YandexProvider } from "@/services/auth/providers/services/yandexProvider"

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
    { provide: UserRepositorySymbol, useClass: DrizzleUserRepository },
    { provide: AccountRepositorySymbol, useClass: DrizzleAccountRepository },
    { provide: MediaListRepositorySymbol, useClass: DrizzleMediaListRepository },
  ],
  exports: [AuthService, AuthProviderGuard, ProvidersModule],
})
export class AuthServiceModule {}
