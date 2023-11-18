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
exports.MediaListService = void 0;
const common_1 = require("@nestjs/common");
const MediaListRepositoryInterface_1 = require("../../repositories/mediaList/MediaListRepositoryInterface");
let MediaListService = class MediaListService {
    constructor(mediaListRepository) {
        this.mediaListRepository = mediaListRepository;
    }
    async isListOwner(id, userId, mediaListBase) {
        const mediaList = mediaListBase ?? (await this.mediaListRepository.getMedialListById(id));
        if (!mediaList) {
            throw new common_1.HttpException(`Media list with id '${id}' doesn't exist.`, common_1.HttpStatus.NOT_FOUND);
        }
        return mediaList.userId === userId;
    }
    async getAllMedialLists(isPublicOnly = false) {
        return this.mediaListRepository.getAllMedialLists(isPublicOnly);
    }
    async getMedialListById(id, userId) {
        const mediaList = await this.mediaListRepository.getMedialListById(id);
        const isListOwner = await this.isListOwner(id, userId, mediaList);
        if (!isListOwner && !mediaList.isPublic) {
            throw new common_1.HttpException('Unauthorized.', common_1.HttpStatus.UNAUTHORIZED);
        }
        return mediaList;
    }
    async getMedialListByUserId(userId, currentUserId) {
        const isPublicOnly = userId !== currentUserId;
        return this.mediaListRepository.getMedialListsByUserId(userId, isPublicOnly);
    }
    async createMediaList(userId) {
        return this.mediaListRepository.createMediaList(userId);
    }
    async updateMediaList(id, body, userId) {
        const isListOwner = await this.isListOwner(id, userId);
        if (isListOwner) {
            throw new common_1.HttpException('Unauthorized.', common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.mediaListRepository.updateMediaList(id, body);
    }
    async deleteMediaList(id, userId) {
        const mediaList = await this.mediaListRepository.getMedialListById(id);
        const isListOwner = await this.isListOwner(id, userId, mediaList);
        if (isListOwner) {
            throw new common_1.HttpException('Unauthorized.', common_1.HttpStatus.UNAUTHORIZED);
        }
        if (mediaList.isSystem) {
            throw new common_1.HttpException('System media list cannot be deleted.', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.mediaListRepository.deleteMediaList(id);
    }
};
exports.MediaListService = MediaListService;
exports.MediaListService = MediaListService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(MediaListRepositoryInterface_1.MediaListRepositorySymbol)),
    __metadata("design:paramtypes", [Object])
], MediaListService);
//# sourceMappingURL=mediaList.service.js.map