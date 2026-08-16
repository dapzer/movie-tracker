import { Module } from "@nestjs/common"
import { DataImportService } from "@/services/dataImport/dataImport.service"
import { DataImportProvidersModule } from "@/services/dataImport/providers/providers.module"
import { TmdbResolver } from "@/services/dataImport/providers/services/base/tmdbResolver"
import { LetterboxdProvider } from "@/services/dataImport/providers/services/letterboxdProvider"
import { TraktProvider } from "@/services/dataImport/providers/services/traktProvider"

@Module({
  imports: [
    DataImportProvidersModule.registerAsync({
      providers: [TmdbResolver, LetterboxdProvider, TraktProvider],
      useFactory: (letterboxdProvider: LetterboxdProvider, traktProvider: TraktProvider) => ({
        services: [letterboxdProvider, traktProvider],
      }),
      inject: [LetterboxdProvider, TraktProvider],
    }),
  ],
  providers: [DataImportService],
  exports: [DataImportService],
})
export class DataImportServiceModule {}
