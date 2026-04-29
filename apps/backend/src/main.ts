import { sessions } from "@movie-tracker/database"
import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { HttpAdapterHost, NestFactory } from "@nestjs/core"
import * as cookieParser from "cookie-parser"
import * as session from "express-session"
import { Logger } from "nestjs-pino"
import { AppModule } from "@/app.module"
import { AllExceptionsFilter } from "@/filters/allException.filter"
import { CustomErrorFilter } from "@/filters/customError.filter"
import { DrizzleClientErrorFilter } from "@/filters/drizzleClientError.filter"
import { PrismaClientErrorFilter } from "@/filters/prismaClientError.filter"
import { DrizzleService } from "@/services/drizzle/drizzle.service"
import { getMillisecondsFromDays } from "@/shared/utils/getMillisecondsFromDays"
import { setupOpenApi } from "./openApi"
import { DrizzleSessionStore } from "./services/drizzle/drizzleSessionStore"
import "dotenv/config"
import "@/services/opentelemetry"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false, bufferLogs: true })
  app.useLogger(app.get(Logger))

  const configService = app.get(ConfigService)
  const httpAdapter = app.get(HttpAdapterHost)
  const drizzle = app.get(DrizzleService)

  app.enableCors({
    origin: true,
    methods: "GET,PUT,PATCH,POST,DELETE",
    credentials: true,
  })

  app.setGlobalPrefix("/api")

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))
  app.useGlobalFilters(new CustomErrorFilter(httpAdapter))
  app.useGlobalFilters(new DrizzleClientErrorFilter())
  app.useGlobalFilters(new PrismaClientErrorFilter(httpAdapter))

  app.use(cookieParser(configService.get("COOKIE_SECRET")))
  app.use(
    session({
      secret: configService.get("SESSION_SECRET"),
      resave: false,
      saveUninitialized: false,
      name: "session",
      cookie: {
        sameSite: "lax",
        httpOnly: true,
        domain: `.${new URL(configService.get("CLIENT_BASE_URL")).hostname}`,
        maxAge: getMillisecondsFromDays(14),
      },
      store: new DrizzleSessionStore(drizzle.client, sessions),
    }),
  )

  setupOpenApi(app, configService)

  const PORT = configService.get("APP_PORT") || 5000

  await app.listen(PORT, "0.0.0.0")
}

bootstrap()
