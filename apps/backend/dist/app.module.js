"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mediaList_module_1 = require("./routes/mediaList/mediaList.module");
const mediaItem_module_1 = require("./routes/mediaItem/mediaItem.module");
const user_module_1 = require("./routes/user/user.module");
const proxy_module_1 = require("./routes/proxy/proxy.module");
const prisma_module_1 = require("./services/prisma/prisma.module");
const auth_module_1 = require("./routes/auth/auth.module");
const mediaDetails_module_1 = require("./routes/mediaDetails/mediaDetails.module");
const schedule_1 = require("@nestjs/schedule");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            mediaList_module_1.MediaListModule,
            mediaItem_module_1.MediaItemModule,
            user_module_1.UserModule,
            proxy_module_1.ProxyModule,
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            mediaDetails_module_1.MediaDetailsModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map