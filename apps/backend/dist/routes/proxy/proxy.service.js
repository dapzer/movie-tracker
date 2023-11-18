"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyService = void 0;
const common_1 = require("@nestjs/common");
let ProxyService = class ProxyService {
    async getResponse(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new common_1.HttpException(`${response.status}: Failed to get data from ${url}.`, common_1.HttpStatus.BAD_GATEWAY);
        }
        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return await response.json();
            }
            else {
                return await response.text();
            }
        }
        catch (err) {
            throw new common_1.HttpException(`Failed to process data received from remote server.`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getImage(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new common_1.HttpException(`${response.status}: Failed to get image from ${url}.`, common_1.HttpStatus.BAD_GATEWAY);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType.includes('image')) {
            throw new common_1.HttpException(`Unsorted content type: ${contentType}.`, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const buffer = await response.arrayBuffer();
            const file = new Uint8Array(buffer);
            const stream = new common_1.StreamableFile(file);
            return {
                stream,
                contentType,
            };
        }
        catch (err) {
            throw new common_1.HttpException(`Failed to process data received from remote server.`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ProxyService = ProxyService;
exports.ProxyService = ProxyService = __decorate([
    (0, common_1.Injectable)()
], ProxyService);
//# sourceMappingURL=proxy.service.js.map