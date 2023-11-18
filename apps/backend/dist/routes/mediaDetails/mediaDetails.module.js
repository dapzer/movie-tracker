"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaDetailsModule = void 0;
const common_1 = require("@nestjs/common");
const mediaDetails_controller_1 = require("./mediaDetails.controller");
const mediaDetails_service_1 = require("./mediaDetails.service");
const PrismaMediaDetailsRepository_1 = require("../../repositories/mediaDetails/PrismaMediaDetailsRepository");
const MediaDetailsRepositoryInterface_1 = require("../../repositories/mediaDetails/MediaDetailsRepositoryInterface");
const MediaItemRepositoryInterface_1 = require("../../repositories/mediaItem/MediaItemRepositoryInterface");
const PrismaMediaItemRepository_1 = require("../../repositories/mediaItem/PrismaMediaItemRepository");
let MediaDetailsModule = class MediaDetailsModule {
};
exports.MediaDetailsModule = MediaDetailsModule;
exports.MediaDetailsModule = MediaDetailsModule = __decorate([
    (0, common_1.Module)({
        controllers: [mediaDetails_controller_1.MediaDetailsController],
        providers: [
            mediaDetails_service_1.MediaDetailsService,
            {
                provide: MediaDetailsRepositoryInterface_1.MediaDetailsRepositorySymbol,
                useClass: PrismaMediaDetailsRepository_1.PrismaMediaDetailsRepository,
            },
            { provide: MediaItemRepositoryInterface_1.MediaItemRepositorySymbol, useClass: PrismaMediaItemRepository_1.PrismaMediaItemRepository },
        ],
        exports: [mediaDetails_service_1.MediaDetailsService],
    })
], MediaDetailsModule);
//# sourceMappingURL=mediaDetails.module.js.map