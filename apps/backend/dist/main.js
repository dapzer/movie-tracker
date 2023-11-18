"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
require("dotenv/config");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const prismaClientError_filter_1 = require("./filters/prismaClientError.filter");
const allException_filter_1 = require("./filters/allException.filter");
const getMillisecondsFromDays_1 = require("./shared/utils/getMillisecondsFromDays");
const prisma_service_1 = require("./services/prisma/prisma.service");
const prisma_session_store_1 = require("@quixo3/prisma-session-store");
const getMillisecondsFromMins_1 = require("./shared/utils/getMillisecondsFromMins");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { abortOnError: false });
    const configService = app.get(config_1.ConfigService);
    const httpAdapter = app.get(core_1.HttpAdapterHost);
    const prisma = app.get(prisma_service_1.PrismaService);
    app.enableCors({
        origin: '*',
        methods: '*',
        credentials: true,
    });
    app.setGlobalPrefix('/api');
    app.useGlobalFilters(new allException_filter_1.AllExceptionsFilter(httpAdapter));
    app.useGlobalFilters(new prismaClientError_filter_1.PrismaClientErrorFilter(httpAdapter));
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.use(cookieParser(configService.get('COOKIE_SECRET')));
    app.use(session({
        secret: configService.get('SESSION_SECRET'),
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: true,
            httpOnly: true,
            maxAge: (0, getMillisecondsFromDays_1.getMillisecondsFromDays)(7),
        },
        store: new prisma_session_store_1.PrismaSessionStore(prisma, {
            checkPeriod: (0, getMillisecondsFromMins_1.getMillisecondsFromMins)(5),
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
    }));
    const PORT = configService.get('APP_PORT') || 5000;
    await app.listen(PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map