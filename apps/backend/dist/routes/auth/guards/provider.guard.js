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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProviderGuard = void 0;
const common_1 = require("@nestjs/common");
const providers_service_1 = require("../providers/providers.service");
let AuthProviderGuard = class AuthProviderGuard {
    constructor(providersService) {
        this.providersService = providersService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const provider = request.params.provider;
        const providerInstance = this.providersService.findService(provider);
        if (!providerInstance) {
            throw new common_1.HttpException('Unknown provider', common_1.HttpStatus.BAD_REQUEST);
        }
        return true;
    }
};
exports.AuthProviderGuard = AuthProviderGuard;
exports.AuthProviderGuard = AuthProviderGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [providers_service_1.ProvidersService])
], AuthProviderGuard);
//# sourceMappingURL=provider.guard.js.map