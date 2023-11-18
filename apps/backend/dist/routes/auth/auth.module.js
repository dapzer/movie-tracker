"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const config_1 = require("@nestjs/config");
const provider_guard_1 = require("./guards/provider.guard");
const providers_module_1 = require("./providers/providers.module");
const githubProvider_1 = require("./providers/services/githubProvider");
const googleProvider_1 = require("./providers/services/googleProvider");
const yandexProvider_1 = require("./providers/services/yandexProvider");
const vkProvider_1 = require("./providers/services/vkProvider");
const UserRepositoryInterface_1 = require("../../repositories/user/UserRepositoryInterface");
const PrismaUserRepository_1 = require("../../repositories/user/PrismaUserRepository");
const AccountRepositoryInterface_1 = require("../../repositories/account/AccountRepositoryInterface");
const PrismaAccountRepository_1 = require("../../repositories/account/PrismaAccountRepository");
const MediaListRepositoryInterface_1 = require("../../repositories/mediaList/MediaListRepositoryInterface");
const PrismaMediaListRepository_1 = require("../../repositories/mediaList/PrismaMediaListRepository");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            providers_module_1.ProvidersModule.registerAsync({
                useFactory: (configService) => {
                    return {
                        baseUrl: configService.get('API_BASE_URL'),
                        services: [
                            new githubProvider_1.GithubProvider({
                                client_id: configService.get('GITHUB_CLIENT_ID'),
                                client_secret: configService.get('GITHUB_CLIENT_SECRET'),
                                scopes: ['read:user', 'user:email'],
                            }),
                            new googleProvider_1.GoogleProvider({
                                client_id: configService.get('GOOGLE_CLIENT_ID'),
                                client_secret: configService.get('GOOGLE_CLIENT_SECRET'),
                                scopes: ['profile', 'email'],
                            }),
                            new yandexProvider_1.YandexProvider({
                                client_id: configService.get('YANDEX_CLIENT_ID'),
                                client_secret: configService.get('YANDEX_CLIENT_SECRET'),
                                scopes: ['login:email', 'login:avatar', 'login:info'],
                            }),
                            new vkProvider_1.VkProvider({
                                client_id: configService.get('VK_CLIENT_ID'),
                                client_secret: configService.get('VK_CLIENT_SECRET'),
                                scopes: ['email'],
                            }),
                        ],
                    };
                },
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [
            auth_service_1.AuthService,
            provider_guard_1.AuthProviderGuard,
            {
                provide: UserRepositoryInterface_1.UserRepositorySymbol,
                useClass: PrismaUserRepository_1.PrismaUserRepository,
            },
            {
                provide: AccountRepositoryInterface_1.AccountRepositorySymbol,
                useClass: PrismaAccountRepository_1.PrismaAccountRepository,
            },
            {
                provide: MediaListRepositoryInterface_1.MediaListRepositorySymbol,
                useClass: PrismaMediaListRepository_1.PrismaMediaListRepository,
            },
        ],
        exports: [auth_service_1.AuthService],
        controllers: [auth_controller_1.AuthController],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map