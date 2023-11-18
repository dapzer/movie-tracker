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
exports.MediaItemController = void 0;
const common_1 = require("@nestjs/common");
const mediaItem_service_1 = require("./mediaItem.service");
const createMediaItem_dto_1 = require("./dto/createMediaItem.dto");
const mediaItemTrackingDataDto_dto_1 = require("./dto/mediaItemTrackingDataDto.dto");
const mongoDbId_dto_1 = require("../../shared/dto/mongoDbId.dto");
const mediaItemListId_dto_1 = require("../../shared/dto/mediaItemListId.dto");
const auth_guard_1 = require("../auth/guards/auth.guard");
const users_decorator_1 = require("../user/users.decorator");
const user_dto_1 = require("../auth/dto/user.dto");
let MediaItemController = class MediaItemController {
    constructor(mediaItemService) {
        this.mediaItemService = mediaItemService;
    }
    async createMediaItem(body, user) {
        return this.mediaItemService.createMediaItem(body.mediaId, body.mediaType, body.mediaListId, user?.id);
    }
    async getMediaItemsByListId(query, user) {
        return this.mediaItemService.getMediaItemsByListId(query.mediaListId, user?.id);
    }
    async deleteMediaItem(params, user) {
        return this.mediaItemService.deleteMediaItem(params.id, user?.id);
    }
    async updateMediaItemTrackingData(param, body, user) {
        return this.mediaItemService.updateMediaItemTrackingData(param.id, body, user?.id);
    }
};
exports.MediaItemController = MediaItemController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createMediaItem_dto_1.CreateMediaItemDto,
        user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], MediaItemController.prototype, "createMediaItem", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mediaItemListId_dto_1.MediaItemListIdDto,
        user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], MediaItemController.prototype, "getMediaItemsByListId", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoDbId_dto_1.MongoDbIdDto, user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], MediaItemController.prototype, "deleteMediaItem", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoDbId_dto_1.MongoDbIdDto,
        mediaItemTrackingDataDto_dto_1.MediaItemTrackingDataDto,
        user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], MediaItemController.prototype, "updateMediaItemTrackingData", null);
exports.MediaItemController = MediaItemController = __decorate([
    (0, common_1.Controller)('mediaItem'),
    __metadata("design:paramtypes", [mediaItem_service_1.MediaItemService])
], MediaItemController);
//# sourceMappingURL=mediaItem.controller.js.map