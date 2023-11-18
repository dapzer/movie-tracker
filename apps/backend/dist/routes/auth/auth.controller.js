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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_guard_1 = require("./guards/auth.guard");
const provider_guard_1 = require("./guards/provider.guard");
const providers_service_1 = require("./providers/providers.service");
const config_1 = require("@nestjs/config");
let AuthController = class AuthController {
    constructor(authService, providersService, configService) {
        this.authService = authService;
        this.providersService = providersService;
        this.configService = configService;
    }
    async callBack(req, code, provider) {
        if (!code)
            throw new common_1.HttpException('No code provided', 400);
        req.session.user = await this.authService.extractProfileFromCode(provider, code);
        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) {
                    return reject(new common_1.HttpException(err.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR));
                }
                resolve(true);
            });
        });
        const clientBaseUrl = this.configService.get('CLIENT_BASE_URL');
        if (!clientBaseUrl) {
            throw new common_1.HttpException('Client base url is not configured', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return {
            url: clientBaseUrl,
        };
    }
    async connect(req, provider) {
        const providerInstance = this.providersService.findService(provider);
        return {
            url: providerInstance.getAuthUrl(),
        };
    }
    async logout(req) {
        return new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) {
                    reject(new common_1.HttpException(err.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR));
                }
                resolve(true);
            });
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('/callback/:provider'),
    (0, common_1.UseGuards)(provider_guard_1.AuthProviderGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('code')),
    __param(2, (0, common_1.Param)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "callBack", null);
__decorate([
    (0, common_1.Get)(['/connect/:provider', '/login/:provider']),
    (0, common_1.UseGuards)(provider_guard_1.AuthProviderGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "connect", null);
__decorate([
    (0, common_1.Post)('/logout'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        providers_service_1.ProvidersService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map