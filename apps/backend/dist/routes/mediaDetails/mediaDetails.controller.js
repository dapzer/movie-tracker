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
exports.MediaDetailsController = void 0;
const common_1 = require("@nestjs/common");
const mediaDetails_service_1 = require("./mediaDetails.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const client_1 = require("@prisma/client");
const roles_guard_1 = require("../../guards/roles.guard");
let MediaDetailsController = class MediaDetailsController {
    constructor(mediaDetailsService) {
        this.mediaDetailsService = mediaDetailsService;
    }
    async createOrUpdateAllMediaDetails() {
        return this.mediaDetailsService.createOrUpdateAllMediaItemsDetails();
    }
};
exports.MediaDetailsController = MediaDetailsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)([client_1.UserRoleEnum.ADMIN]),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediaDetailsController.prototype, "createOrUpdateAllMediaDetails", null);
exports.MediaDetailsController = MediaDetailsController = __decorate([
    (0, common_1.Controller)('mediaDetails'),
    __metadata("design:paramtypes", [mediaDetails_service_1.MediaDetailsService])
], MediaDetailsController);
//# sourceMappingURL=mediaDetails.controller.js.map