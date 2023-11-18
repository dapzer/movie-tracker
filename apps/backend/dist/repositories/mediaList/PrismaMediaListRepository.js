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
exports.PrismaMediaListRepository = void 0;
const prisma_service_1 = require("../../services/prisma/prisma.service");
const common_1 = require("@nestjs/common");
let PrismaMediaListRepository = class PrismaMediaListRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllMedialLists(isPublicOnly = false) {
        return this.prisma.mediaList.findMany({
            where: {
                ...(isPublicOnly && { isPublic: true }),
            },
        });
    }
    async getMedialListById(id) {
        return this.prisma.mediaList.findUnique({
            where: {
                id,
            },
        });
    }
    async getMedialListsByUserId(userId, isPublicOnly = false) {
        return this.prisma.mediaList.findMany({
            where: {
                userId,
                ...(isPublicOnly && { isPublic: true }),
            },
        });
    }
    async createMediaList(userId, isSystem = false) {
        return this.prisma.mediaList.create({
            data: {
                userId,
                isSystem,
            },
        });
    }
    async deleteMediaList(id) {
        return this.prisma.mediaList.delete({
            where: {
                id,
            },
        });
    }
    async updateMediaList(id, body) {
        return this.prisma.mediaList.update({
            where: { id },
            data: {
                ...body,
            },
        });
    }
};
exports.PrismaMediaListRepository = PrismaMediaListRepository;
exports.PrismaMediaListRepository = PrismaMediaListRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaMediaListRepository);
//# sourceMappingURL=PrismaMediaListRepository.js.map