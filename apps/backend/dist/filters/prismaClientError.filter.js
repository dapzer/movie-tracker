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
exports.PrismaClientErrorFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const core_1 = require("@nestjs/core");
let PrismaClientErrorFilter = class PrismaClientErrorFilter {
    constructor(httpAdapterHost) {
        this.httpAdapterHost = httpAdapterHost;
        this.exceptions = {
            badRequest: {
                code: 'P2000',
                status: common_1.HttpStatus.BAD_REQUEST,
            },
            conflict: {
                code: 'P2002',
                status: common_1.HttpStatus.CONFLICT,
            },
            notFound: {
                code: 'P2025',
                status: common_1.HttpStatus.NOT_FOUND,
            },
        };
    }
    catch(exception, host) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let status = common_1.HttpStatus.BAD_REQUEST;
        let message = 'Unexpected error';
        if (exception.code === this.exceptions.conflict.code) {
            const nonUniqueFields = exception.meta.target.split('_');
            message = `Field(s) '${nonUniqueFields
                .slice(1, -1)
                .join(', ')}' must be unique.`;
        }
        else if (exception.code === this.exceptions.notFound.code) {
            status = this.exceptions.conflict.status;
            message = 'Not found';
        }
        response.status(status).json({
            statusCode: status,
            message: message,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
        });
    }
};
exports.PrismaClientErrorFilter = PrismaClientErrorFilter;
exports.PrismaClientErrorFilter = PrismaClientErrorFilter = __decorate([
    (0, common_1.Catch)(client_1.Prisma.PrismaClientKnownRequestError),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost])
], PrismaClientErrorFilter);
//# sourceMappingURL=prismaClientError.filter.js.map