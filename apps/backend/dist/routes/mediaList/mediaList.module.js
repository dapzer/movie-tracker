"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaListModule = void 0;
const common_1 = require("@nestjs/common");
const mediaList_controller_1 = require("./mediaList.controller");
const mediaList_service_1 = require("./mediaList.service");
const MediaListRepositoryInterface_1 = require("../../repositories/mediaList/MediaListRepositoryInterface");
const PrismaMediaListRepository_1 = require("../../repositories/mediaList/PrismaMediaListRepository");
let MediaListModule = class MediaListModule {
};
exports.MediaListModule = MediaListModule;
exports.MediaListModule = MediaListModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [mediaList_controller_1.MediaListController],
        providers: [
            mediaList_service_1.MediaListService,
            { provide: MediaListRepositoryInterface_1.MediaListRepositorySymbol, useClass: PrismaMediaListRepository_1.PrismaMediaListRepository },
        ],
        exports: [mediaList_service_1.MediaListService],
    })
], MediaListModule);
//# sourceMappingURL=mediaList.module.js.map