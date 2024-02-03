import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MediaListModule } from '@/routes/mediaList/mediaList.module';
import { MediaItemModule } from '@/routes/mediaItem/mediaItem.module';
import { UserModule } from './routes/user/user.module';
import { ProxyModule } from './routes/proxy/proxy.module';
import { PrismaModule } from '@/services/prisma/prisma.module';
import { AuthModule } from '@/routes/auth/auth.module';
import { MediaDetailsModule } from '@/routes/mediaDetails/mediaDetails.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SitemapModule } from '@/routes/sitemap/sitemap.module';
import { MigrateModule } from '@/routes/migrate/migrate.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MediaListModule,
    MediaItemModule,
    UserModule,
    ProxyModule,
    PrismaModule,
    AuthModule,
    MediaDetailsModule,
    SitemapModule,
    MigrateModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
