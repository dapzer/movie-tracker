import { Module } from "@nestjs/common"
import { DataImportController } from "@/delivery/http/dataImport/dataImport.controller"
import { DataImportServiceModule } from "@/services/dataImport/dataImport.module"

@Module({
  imports: [DataImportServiceModule],
  controllers: [DataImportController],
})
export class DataImportModule {}
