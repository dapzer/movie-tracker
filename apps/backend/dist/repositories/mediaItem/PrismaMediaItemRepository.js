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
exports.PrismaMediaItemRepository = void 0;
const prisma_service_1 = require("../../services/prisma/prisma.service");
const client_1 = require("@prisma/client");
const common_1 = require("@nestjs/common");
let PrismaMediaItemRepository = class PrismaMediaItemRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllMediaItems() {
        return this.prisma.mediaItem.findMany();
    }
    async getMediaItemById(id) {
        return this.prisma.mediaItem.findUnique({
            where: { id },
        });
    }
    async getMediaItemsByListId(mediaListId) {
        return this.prisma.mediaItem.findMany({
            where: {
                mediaListId,
            },
            include: {
                mediaDetails: true,
            },
        });
    }
    async createMediaItem(mediaId, mediaType, mediaListId, mediaDetailsId) {
        return this.prisma.mediaItem.create({
            data: {
                mediaListId,
                mediaId,
                mediaType,
                mediaDetailsId,
                trackingData: {
                    currentStatus: client_1.StatusNameEnum.NOT_VIEWED,
                    note: '',
                    sitesToView: [],
                    score: null,
                    seriesInfo: {
                        currentSeason: 0,
                        currentEpisode: 1,
                    },
                },
            },
            include: {
                mediaDetails: true,
            },
        });
    }
    async deleteMediaItem(id) {
        return this.prisma.mediaItem.delete({
            where: {
                id,
            },
        });
    }
    async updateMediaItemTrackingData(id, trackingData) {
        return this.prisma.mediaItem.update({
            where: { id },
            data: {
                trackingData,
            },
            include: {
                mediaDetails: true,
            },
        });
    }
    async updateMediaItem(id, data) {
        return this.prisma.mediaItem.update({
            where: { id },
            data,
            include: {
                mediaDetails: true,
            },
        });
    }
};
exports.PrismaMediaItemRepository = PrismaMediaItemRepository;
exports.PrismaMediaItemRepository = PrismaMediaItemRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaMediaItemRepository);
//# sourceMappingURL=PrismaMediaItemRepository.js.map