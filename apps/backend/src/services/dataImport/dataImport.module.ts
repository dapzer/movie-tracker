import { Module } from "@nestjs/common"
import { DataImportRepositorySymbol } from "@/repositories/dataImport/DataImportRepositoryInterface"
import { DrizzleDataImportRepository } from "@/repositories/dataImport/DrizzleDataImportRepository"
import { DrizzleMediaItemRepository } from "@/repositories/mediaItem/DrizzleMediaItemRepository"
import { MediaItemRepositorySymbol } from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import { DataImportService } from "@/services/dataImport/dataImport.service"
import { DataImportProvidersModule } from "@/services/dataImport/providers/providers.module"
import { TmdbResolver } from "@/services/dataImport/providers/services/base/tmdbResolver"
import { LetterboxdProvider } from "@/services/dataImport/providers/services/letterboxdProvider"
import { TraktProvider } from "@/services/dataImport/providers/services/traktProvider"
import { MediaItemsServiceModule } from "@/services/mediaItems/mediaItems.module"
import { MediaListsServiceModule } from "@/services/mediaLists/mediaLists.module"

@Module({
  imports: [
    MediaItemsServiceModule,
    MediaListsServiceModule,
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
  ],
  exports: [DataImportService],
})
export class DataImportServiceModule {}
