import { Module } from "@nestjs/common"
import { DataImportRepositorySymbol } from "@/repositories/dataImport/DataImportRepositoryInterface"
import { DrizzleDataImportRepository } from "@/repositories/dataImport/DrizzleDataImportRepository"
import { DrizzleMediaItemRepository } from "@/repositories/mediaItem/DrizzleMediaItemRepository"
import { MediaItemRepositorySymbol } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { DrizzleMediaRatingRepository } from "@/repositories/mediaRating/DrizzleMediaRatingRepository"
import { MediaRatingRepositorySymbol } from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { DataImportService } from "@/services/dataImport/dataImport.service"
import { DataImportProvidersModule } from "@/services/dataImport/providers/providers.module"
import { TmdbResolver } from "@/services/dataImport/providers/services/base/tmdbResolver"
import { LetterboxdProvider } from "@/services/dataImport/providers/services/letterboxdProvider"
import { TraktProvider } from "@/services/dataImport/providers/services/traktProvider"
import { MediaItemsServiceModule } from "@/services/mediaItems/mediaItems.module"
import { MediaListsServiceModule } from "@/services/mediaLists/mediaLists.module"
import { MediaRatingsServiceModule } from "@/services/mediaRatings/mediaRatings.module"
import { MediaReviewsServiceModule } from "@/services/mediaReviews/mediaReviews.module"

@Module({
  imports: [
    MediaItemsServiceModule,
    MediaListsServiceModule,
    MediaRatingsServiceModule,
    MediaReviewsServiceModule,
    DataImportProvidersModule.registerAsync({
      providers: [TmdbResolver, LetterboxdProvider, TraktProvider],
      useFactory: (letterboxdProvider: LetterboxdProvider, traktProvider: TraktProvider) => ({
        services: [letterboxdProvider, traktProvider],
      }),
      inject: [LetterboxdProvider, TraktProvider],
    }),
  ],
  providers: [
    DataImportService,
    { provide: DataImportRepositorySymbol, useClass: DrizzleDataImportRepository },
    { provide: MediaItemRepositorySymbol, useClass: DrizzleMediaItemRepository },
    { provide: MediaRatingRepositorySymbol, useClass: DrizzleMediaRatingRepository },
  ],
  exports: [DataImportService],
})
export class DataImportServiceModule {}
