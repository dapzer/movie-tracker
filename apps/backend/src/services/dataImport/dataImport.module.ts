import { Module } from "@nestjs/common"
import { DataImportService } from "@/services/dataImport/dataImport.service"
import { DataImportProvidersModule } from "@/services/dataImport/providers/providers.module"
import { LetterboxdProvider } from "@/services/dataImport/providers/services/letterboxdProvider"
import { TmdbProvider } from "@/services/dataImport/providers/services/tmdbProvider"
import { TraktProvider } from "@/services/dataImport/providers/services/traktProvider"

@Module({
  imports: [
    DataImportProvidersModule.registerAsync({
      useFactory: () => {
        const tmdbProvider = new TmdbProvider()
        return {
          services: [
            new LetterboxdProvider(tmdbProvider),
            new TraktProvider(tmdbProvider),
          ],
        }
      },
    }),
  ],
  providers: [DataImportService],
  exports: [DataImportService],
})
export class DataImportServiceModule {}
