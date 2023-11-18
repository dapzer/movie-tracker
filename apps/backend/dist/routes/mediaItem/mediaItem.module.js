"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaItemModule = void 0;
const common_1 = require("@nestjs/common");
const mediaItem_controller_1 = require("./mediaItem.controller");
const mediaItem_service_1 = require("./mediaItem.service");
const mediaList_module_1 = require("../mediaList/mediaList.module");
const MediaItemRepositoryInterface_1 = require("../../repositories/mediaItem/MediaItemRepositoryInterface");
const PrismaMediaItemRepository_1 = require("../../repositories/mediaItem/PrismaMediaItemRepository");
const MediaListRepositoryInterface_1 = require("../../repositories/mediaList/MediaListRepositoryInterface");
const PrismaMediaListRepository_1 = require("../../repositories/mediaList/PrismaMediaListRepository");
const mediaDetails_module_1 = require("../mediaDetails/mediaDetails.module");
let MediaItemModule = class MediaItemModule {
};
exports.MediaItemModule = MediaItemModule;
exports.MediaItemModule = MediaItemModule = __decorate([
    (0, common_1.Module)({
        controllers: [mediaItem_controller_1.MediaItemController],
        providers: [
            mediaItem_service_1.MediaItemService,
            { provide: MediaListRepositoryInterface_1.MediaListRepositorySymbol, useClass: PrismaMediaListRepository_1.PrismaMediaListRepository },
            { provide: MediaItemRepositoryInterface_1.MediaItemRepositorySymbol, useClass: PrismaMediaItemRepository_1.PrismaMediaItemRepository },
        ],
        imports: [mediaList_module_1.MediaListModule, mediaDetails_module_1.MediaDetailsModule],
    })
], MediaItemModule);
//# sourceMappingURL=mediaItem.module.js.map