"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProvidersModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersModule = void 0;
const common_1 = require("@nestjs/common");
const providers_service_1 = require("./providers.service");
const constants_1 = require("./constants");
let ProvidersModule = ProvidersModule_1 = class ProvidersModule {
    static register(opts) {
        return {
            module: ProvidersModule_1,
            providers: [
                {
                    useValue: opts.services,
                    provide: constants_1.ProvidersOptsSymbol,
                },
                providers_service_1.ProvidersService,
            ],
            exports: [providers_service_1.ProvidersService],
        };
    }
    static registerAsync(opts) {
        return {
            module: ProvidersModule_1,
            imports: opts.imports,
            providers: [
                {
                    useFactory: opts.useFactory,
                    provide: constants_1.ProvidersOptsSymbol,
                    inject: opts.inject,
                },
                providers_service_1.ProvidersService,
            ],
            exports: [providers_service_1.ProvidersService],
        };
    }
};
exports.ProvidersModule = ProvidersModule;
exports.ProvidersModule = ProvidersModule = ProvidersModule_1 = __decorate([
    (0, common_1.Module)({})
], ProvidersModule);
//# sourceMappingURL=providers.module.js.map