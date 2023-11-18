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
exports.MediaItemService = void 0;
const common_1 = require("@nestjs/common");
const MediaItemRepositoryInterface_1 = require("../../repositories/mediaItem/MediaItemRepositoryInterface");
const MediaListRepositoryInterface_1 = require("../../repositories/mediaList/MediaListRepositoryInterface");
const mediaDetails_service_1 = require("../mediaDetails/mediaDetails.service");
let MediaItemService = class MediaItemService {
    constructor(mediaListRepository, mediaItemRepository, mediaDetailsService) {
        this.mediaListRepository = mediaListRepository;
        this.mediaItemRepository = mediaItemRepository;
        this.mediaDetailsService = mediaDetailsService;
    }
    async isMediaItemOwner(id, userId, mediaItemBase) {
        const mediaItem = mediaItemBase ?? (await this.mediaItemRepository.getMediaItemById(id));
        const mediaList = await this.mediaListRepository.getMedialListById(mediaItem.mediaListId);
        if (!mediaItem || !mediaList) {
            throw new common_1.HttpException(`Media item with id '${id}' doesn't exist.`, common_1.HttpStatus.NOT_FOUND);
        }
        return mediaList.userId === userId;
    }
    async createMediaItem(mediaId, mediaType, mediaListId, userId) {
        const mediaList = await this.mediaListRepository.getMedialListById(mediaListId);
        if (!mediaList) {
            throw new common_1.HttpException(`Media list with id '${mediaListId}' doesn't exist.`, common_1.HttpStatus.NOT_FOUND);
        }
        if (mediaList.userId !== userId) {
            throw new common_1.HttpException('Unauthorized.', common_1.HttpStatus.UNAUTHORIZED);
        }
        const mediaDetails = await this.mediaDetailsService.createOrUpdateMediaDetails(mediaId, mediaType, null);
        return this.mediaItemRepository.createMediaItem(mediaId, mediaType, mediaListId, mediaDetails.id);
    }
    async getMediaItemsByListId(mediaListId, userId) {
        const mediaList = await this.mediaListRepository.getMedialListById(mediaListId);
        if (mediaList && mediaList.userId !== userId && !mediaList.isPublic) {
            throw new common_1.HttpException(`Unauthorized.`, common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.mediaItemRepository.getMediaItemsByListId(mediaListId);
    }
    async deleteMediaItem(id, userId) {
        const isMediaItemOwner = await this.isMediaItemOwner(id, userId);
        if (!isMediaItemOwner) {
            throw new common_1.HttpException('Unauthorized.', common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.mediaItemRepository.deleteMediaItem(id);
    }
    async updateMediaItemTrackingData(id, trackingData, userId) {
        const isMediaItemOwner = await this.isMediaItemOwner(id, userId);
        if (!isMediaItemOwner) {
            throw new common_1.HttpException('Unauthorized.', common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.mediaItemRepository.updateMediaItemTrackingData(id, trackingData);
    }
};
exports.MediaItemService = MediaItemService;
exports.MediaItemService = MediaItemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(MediaListRepositoryInterface_1.MediaListRepositorySymbol)),
    __param(1, (0, common_1.Inject)(MediaItemRepositoryInterface_1.MediaItemRepositorySymbol)),
    __metadata("design:paramtypes", [Object, Object, mediaDetails_service_1.MediaDetailsService])
], MediaItemService);
//# sourceMappingURL=mediaItem.service.js.map