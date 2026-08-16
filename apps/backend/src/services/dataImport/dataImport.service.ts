import { Buffer } from "node:buffer"
import { Injectable } from "@nestjs/common"
import { ImportRawResult } from "@/services/dataImport/dto/importResult.dto"
import { DataImportSource } from "@/services/dataImport/dto/importSource.dto"
import { DataImportProvidersService } from "@/services/dataImport/providers/providers.service"
import { extractArchiveData } from "@/shared/utils/extractArchiveData"

@Injectable()
export class DataImportService {
  constructor(private readonly providersService: DataImportProvidersService) {}

  async import(args: { source: DataImportSource, archive: Buffer | Uint8Array }): Promise<ImportRawResult> {
    const provider = this.providersService.findService(args.source)
    const files = await extractArchiveData(args.archive)

    provider.validateFiles({ files })

    return provider.import({ files })
  }
}
