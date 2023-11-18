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
exports.PrismaMediaDetailsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../services/prisma/prisma.service");
let PrismaMediaDetailsRepository = class PrismaMediaDetailsRepository {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async createMediaDetails(mediaId, mediaType, mediaDetailsInfoRu, mediaDetailsInfoEn, score) {
        return this.prismaService.mediaDetails.create({
            data: {
                mediaId,
                mediaType,
                ru: mediaDetailsInfoRu,
                en: mediaDetailsInfoEn,
                score,
            },
        });
    }
    async updateMediaDetails(mediaId, mediaType, mediaDetailsInfoRu, mediaDetailsInfoEn, score) {
        return this.prismaService.mediaDetails.update({
            where: {
                mediaId_mediaType: {
                    mediaId,
                    mediaType,
                },
            },
            data: {
                ru: mediaDetailsInfoRu,
                en: mediaDetailsInfoEn,
                score,
            },
        });
    }
    async getMediaDetailsItem(mediaId, mediaType) {
        return this.prismaService.mediaDetails.findUnique({
            where: {
                mediaId_mediaType: {
                    mediaId,
                    mediaType,
                },
            },
        });
    }
};
exports.PrismaMediaDetailsRepository = PrismaMediaDetailsRepository;
exports.PrismaMediaDetailsRepository = PrismaMediaDetailsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaMediaDetailsRepository);
//# sourceMappingURL=PrismaMediaDetailsRepository.js.map