"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const providers_service_1 = require("./providers/providers.service");
const UserRepositoryInterface_1 = require("../../repositories/user/UserRepositoryInterface");
const AccountRepositoryInterface_1 = require("../../repositories/account/AccountRepositoryInterface");
const MediaListRepositoryInterface_1 = require("../../repositories/mediaList/MediaListRepositoryInterface");
let AuthService = class AuthService {
    constructor(config, providersService, usersRepository, accountRepository, mediaListRepository) {
        this.config = config;
        this.providersService = providersService;
        this.usersRepository = usersRepository;
        this.accountRepository = accountRepository;
        this.mediaListRepository = mediaListRepository;
    }
    async extractProfileFromCode(provider, code) {
        const providerInstance = this.providersService.findService(provider);
        const profile = await providerInstance.getUserByCode(code);
        let account = await this.accountRepository.getAccountByProvider(profile.provider, profile.id);
        let user = account?.userId
            ? await this.usersRepository.getUserById(account?.userId)
            : null;
        if (user) {
            user = await this.usersRepository.updateUser(user.id, {
                name: profile.name,
                image: profile.avatarUrl,
            });
        }
        else {
            user = await this.usersRepository.createUser({
                email: profile.email,
                name: profile.name,
                image: profile.avatarUrl,
            });
            await this.mediaListRepository.createMediaList(user.id, true);
        }
        if (!account) {
            await this.accountRepository.createAccount({
                userId: user.id,
                type: 'oauth',
                provider: profile.provider,
                providerAccountId: profile.id,
                refresh_token: profile.refresh_token,
                access_token: profile.access_token,
                expires_at: profile.expires_at,
            });
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(UserRepositoryInterface_1.UserRepositorySymbol)),
    __param(3, (0, common_1.Inject)(AccountRepositoryInterface_1.AccountRepositorySymbol)),
    __param(4, (0, common_1.Inject)(MediaListRepositoryInterface_1.MediaListRepositorySymbol)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        providers_service_1.ProvidersService, Object, Object, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map