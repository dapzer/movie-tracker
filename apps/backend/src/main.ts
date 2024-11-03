import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { getMillisecondsFromDays } from '@/shared/utils/getMillisecondsFromDays';
import { PrismaService } from '@/services/prisma/prisma.service';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { getMillisecondsFromMins } from '@/shared/utils/getMillisecondsFromMins';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  const configService = app.get(ConfigService);
  const httpAdapter = app.get(HttpAdapterHost);
  const prisma = app.get(PrismaService);

  app.enableCors({
    origin: true,
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('/api');
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalFilters(new PrismaClientErrorFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser(configService.get('COOKIE_SECRET')));
  app.use(
    session({
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      name: "session",
      cookie: {
        sameSite: "none",
        httpOnly: true,
        domain: `.${new URL(configService.get('CLIENT_BASE_URL')).hostname}`,
        maxAge: getMillisecondsFromDays(7),
      },
      store: new PrismaSessionStore(prisma, {
        checkPeriod: getMillisecondsFromMins(5),
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    }),
  );

  const PORT = configService.get('APP_PORT') || 5000;

  await app.listen(PORT, '0.0.0.0');
}

bootstrap();
