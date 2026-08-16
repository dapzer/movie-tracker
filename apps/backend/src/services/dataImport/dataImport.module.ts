import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Module } from "@nestjs/common"
import { Cache } from "cache-manager"
import { DataImportService } from "@/services/dataImport/dataImport.service"
import { DataImportProvidersModule } from "@/services/dataImport/providers/providers.module"
import { LetterboxdProvider } from "@/services/dataImport/providers/services/letterboxdProvider"
import { TmdbProvider } from "@/services/dataImport/providers/services/tmdbProvider"
import { TraktProvider } from "@/services/dataImport/providers/services/traktProvider"

@Module({
  imports: [
    DataImportProvidersModule.registerAsync({
      useFactory: (cacheManager: Cache) => {
        const tmdbProvider = new TmdbProvider(cacheManager)
        return {
          services: [
            new LetterboxdProvider(tmdbProvider),
            new TraktProvider(tmdbProvider),
          ],
        }
      },
      inject: [CACHE_MANAGER],
    }),
  ],
  providers: [DataImportService],
  exports: [DataImportService],
})
export class DataImportServiceModule {}
