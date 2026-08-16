import { Buffer } from "node:buffer"
import { Controller, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { DataImportControllerDocs, ImportDataDocs } from "@/delivery/http/dataImport/dataImport.controller.docs"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { DataImportService } from "@/services/dataImport/dataImport.service"
import { ImportDataQueryDto } from "@/services/dataImport/dto/importDataQuery.dto"
import { DataImportArchiveIsRequiredError } from "@/shared/errors/dataImport"

@Controller("data-import")
@DataImportControllerDocs()
export class DataImportController {
  constructor(private readonly dataImportService: DataImportService) {}

  @Post()
  @ImportDataDocs()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("archive"))
  async importData(
    @Query() query: ImportDataQueryDto,
    @UploadedFile() file?: { buffer: Buffer },
  ) {
    if (!file) {
      throw new DataImportArchiveIsRequiredError()
    }

    return this.dataImportService.import({
      source: query.source,
      archive: file.buffer,
    })
  }
}
