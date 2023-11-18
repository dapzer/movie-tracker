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
exports.MediaDetailsService = void 0;
const common_1 = require("@nestjs/common");
const MediaDetailsRepositoryInterface_1 = require("../../repositories/mediaDetails/MediaDetailsRepositoryInterface");
const MediaItemRepositoryInterface_1 = require("../../repositories/mediaItem/MediaItemRepositoryInterface");
const config_1 = require("@nestjs/config");
const generateApiUrl_1 = require("../../shared/utils/generateApiUrl");
const convertMediaDetailsToMediaDetailsInfo_1 = require("../../shared/utils/convertMediaDetailsToMediaDetailsInfo");
const convertArrayToChunks_1 = require("../../shared/utils/convertArrayToChunks");
const schedule_1 = require("@nestjs/schedule");
const getMillisecondsFromHours_1 = require("../../shared/utils/getMillisecondsFromHours");
let MediaDetailsService = class MediaDetailsService {
    constructor(mediaDetailsRepository, mediaItemRepository, configService) {
        this.mediaDetailsRepository = mediaDetailsRepository;
        this.mediaItemRepository = mediaItemRepository;
        this.configService = configService;
        this.updatingProgress = {
            successfulUpdates: 0,
            failedUpdatesByApi: 0,
            failedUpdatesByDb: 0,
        };
        this.logger = new common_1.Logger('MediaDetailsService');
        this.getApiUrl = (0, generateApiUrl_1.generateApiUrl)(this.configService.get('TMDB_API_URL'), {
            api_key: this.configService.get('TMDB_API_KEY'),
        });
    }
    async onModuleInit() {
        this.createOrUpdateAllMediaItemsDetails();
    }
    async autoUpdateAllMediaDetails() {
        this.createOrUpdateAllMediaItemsDetails();
    }
    async getMediaDetailsItemFromApi(mediaId, mediaType, language) {
        const response = await fetch(this.getApiUrl(`/${mediaType.toLowerCase()}/${mediaId}`, {
            language,
        }));
        if (response.ok) {
            return await response.json();
        }
        else {
            return null;
        }
    }
    async getAllMediaDetails(mediaId, mediaType) {
        try {
            const [ru, en] = await Promise.all([
                this.getMediaDetailsItemFromApi(mediaId, mediaType, 'ru'),
                this.getMediaDetailsItemFromApi(mediaId, mediaType, 'en'),
            ]);
            return {
                ru,
                en,
            };
        }
        catch (error) {
            this.logger.error('Failed to get data from TMDB.');
            return {
                ru: null,
                en: null,
            };
        }
    }
    async createOrUpdateMediaDetails(mediaId, mediaType, skipError = false, mediaItem) {
        const { ru, en } = await this.getAllMediaDetails(mediaId, mediaType);
        if (!ru || !en) {
            this.updatingProgress.failedUpdatesByApi += 1;
            if (skipError) {
                return null;
            }
            throw new common_1.HttpException('Media details not found', common_1.HttpStatus.NOT_FOUND);
        }
        const mediaDetails = await this.mediaDetailsRepository.getMediaDetailsItem(mediaId, mediaType);
        let mediaDetailsItem = null;
        try {
            if (!mediaDetails) {
                mediaDetailsItem = await this.mediaDetailsRepository.createMediaDetails(mediaId, mediaType, (0, convertMediaDetailsToMediaDetailsInfo_1.convertMediaDetailsToMediaDetailsInfo)(ru), (0, convertMediaDetailsToMediaDetailsInfo_1.convertMediaDetailsToMediaDetailsInfo)(en), en.vote_average || 0);
            }
            mediaDetailsItem = await this.mediaDetailsRepository.updateMediaDetails(mediaId, mediaType, (0, convertMediaDetailsToMediaDetailsInfo_1.convertMediaDetailsToMediaDetailsInfo)(ru), (0, convertMediaDetailsToMediaDetailsInfo_1.convertMediaDetailsToMediaDetailsInfo)(en), en?.vote_average || 0);
            if (mediaDetails && mediaItem && !mediaItem?.mediaDetailsId) {
                await this.mediaItemRepository.updateMediaItem(mediaItem.id, {
                    mediaDetailsId: mediaDetailsItem.id,
                });
            }
            this.updatingProgress.successfulUpdates += 1;
            return mediaDetailsItem;
        }
        catch (error) {
            this.updatingProgress.failedUpdatesByDb += 1;
            if (skipError) {
                return null;
            }
            throw new common_1.HttpException('Failed to create or update media details', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createOrUpdateAllMediaItemsDetails() {
        const mediaItems = await this.mediaItemRepository.getAllMediaItems();
        if (!mediaItems) {
            throw new common_1.HttpException('Media items not found', common_1.HttpStatus.NOT_FOUND);
        }
        const chunks = (0, convertArrayToChunks_1.convertArrayToChunks)(mediaItems, 20);
        let iteration = 1;
        this.updatingProgress = {
            successfulUpdates: 0,
            failedUpdatesByApi: 0,
            failedUpdatesByDb: 0,
        };
        for (const chunk of chunks) {
            const promiseArr = chunk.map((mediaItem) => {
                return this.createOrUpdateMediaDetails(mediaItem.mediaId, mediaItem.mediaType, true, mediaItem);
            });
            await Promise.all(promiseArr);
            if (iteration < chunks.length) {
                iteration += 1;
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
        this.logger.log(`Successful updates: ${this.updatingProgress.successfulUpdates} / Failed updates by API: ${this.updatingProgress.failedUpdatesByApi} / Failed updates by DB: ${this.updatingProgress.failedUpdatesByDb}`);
        return this.updatingProgress;
    }
};
exports.MediaDetailsService = MediaDetailsService;
__decorate([
    (0, schedule_1.Interval)((0, getMillisecondsFromHours_1.getMillisecondsFromHours)(8)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediaDetailsService.prototype, "autoUpdateAllMediaDetails", null);
exports.MediaDetailsService = MediaDetailsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(MediaDetailsRepositoryInterface_1.MediaDetailsRepositorySymbol)),
    __param(1, (0, common_1.Inject)(MediaItemRepositoryInterface_1.MediaItemRepositorySymbol)),
    __metadata("design:paramtypes", [Object, Object, config_1.ConfigService])
], MediaDetailsService);
//# sourceMappingURL=mediaDetails.service.js.map