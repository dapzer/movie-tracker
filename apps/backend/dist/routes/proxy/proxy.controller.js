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
exports.ProxyController = void 0;
const common_1 = require("@nestjs/common");
const proxy_service_1 = require("./proxy.service");
const proxyQueries__dto_1 = require("./dto/proxyQueries..dto");
let ProxyController = class ProxyController {
    constructor(proxyService) {
        this.proxyService = proxyService;
    }
    async getResponse(queries) {
        return this.proxyService.getResponse(queries.url);
    }
    async getImage(res, queries) {
        const { stream, contentType } = await this.proxyService.getImage(queries.url);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'filename=image.jpg');
        return stream.getStream().pipe(res);
    }
};
exports.ProxyController = ProxyController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [proxyQueries__dto_1.ProxyQueriesDto]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "getResponse", null);
__decorate([
    (0, common_1.Get)('image'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, proxyQueries__dto_1.ProxyQueriesDto]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "getImage", null);
exports.ProxyController = ProxyController = __decorate([
    (0, common_1.Controller)('proxy'),
    __metadata("design:paramtypes", [proxy_service_1.ProxyService])
], ProxyController);
//# sourceMappingURL=proxy.controller.js.map