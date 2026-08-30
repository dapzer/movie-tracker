import { Module } from "@nestjs/common"
import { DataImportController } from "@/delivery/http/dataImport/dataImport.controller"
import { ThrottlerBehindProxyGuard } from "@/guards/throttlerBehindProxy.guard"
import { DataImportServiceModule } from "@/services/dataImport/dataImport.module"

@Module({
  imports: [DataImportServiceModule],
  controllers: [DataImportController],
  providers: [ThrottlerBehindProxyGuard],
})
export class DataImportModule {}
