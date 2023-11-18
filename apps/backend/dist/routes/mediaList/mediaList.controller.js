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
exports.MediaListController = void 0;
const common_1 = require("@nestjs/common");
const mediaList_service_1 = require("./mediaList.service");
const mongoDbId_dto_1 = require("../../shared/dto/mongoDbId.dto");
const updateMediaList_dto_1 = require("./dto/updateMediaList.dto");
const auth_guard_1 = require("../auth/guards/auth.guard");
const users_decorator_1 = require("../user/users.decorator");
const user_dto_1 = require("../auth/dto/user.dto");
const getAllMediaLists_dto_1 = require("./dto/getAllMediaLists.dto");
let MediaListController = class MediaListController {
    constructor(mediaListService) {
        this.mediaListService = mediaListService;
    }
    async getMedialListByUserId(queries, user) {
        if (queries.userId) {
            return this.mediaListService.getMedialListByUserId(queries.userId, user?.id);
        }
        return this.mediaListService.getMedialListByUserId(user?.id, user?.id);
    }
    async getMedialListById(params, user) {
        return this.mediaListService.getMedialListById(params.id, user?.id);
    }
    async createMediaList(user) {
        return this.mediaListService.createMediaList(user?.id);
    }
    async updateMediaList(params, body, user) {
        return this.mediaListService.updateMediaList(params.id, body, user?.id);
    }
    async deleteMediaList(params, user) {
        return this.mediaListService.deleteMediaList(params.id, user?.id);
    }
};
exports.MediaListController = MediaListController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getAllMediaLists_dto_1.GetAllMediaListsDto,
        user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], MediaListController.prototype, "getMedialListByUserId", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoDbId_dto_1.MongoDbIdDto,
        user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], MediaListController.prototype, "getMedialListById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], MediaListController.prototype, "createMediaList", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoDbId_dto_1.MongoDbIdDto,
        updateMediaList_dto_1.UpdateMediaListDto,
        user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], MediaListController.prototype, "updateMediaList", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoDbId_dto_1.MongoDbIdDto, user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], MediaListController.prototype, "deleteMediaList", null);
exports.MediaListController = MediaListController = __decorate([
    (0, common_1.Controller)('mediaList'),
    __metadata("design:paramtypes", [mediaList_service_1.MediaListService])
], MediaListController);
//# sourceMappingURL=mediaList.controller.js.map