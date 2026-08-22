import { Buffer } from "node:buffer"
import { DataImportRawResultType, DataImportSourceEnum } from "@movie-tracker/types"
import { Inject, Injectable } from "@nestjs/common"
import {
  DataImportRepositoryInterface,
  DataImportRepositorySymbol,
} from "@/repositories/dataImport/DataImportRepositoryInterface"
import { DataImportProvidersService } from "@/services/dataImport/providers/providers.service"
import { DataImportNotFoundError, DataImportUnauthorizedError } from "@/shared/errors/dataImport"
import { extractArchiveData } from "@/shared/utils/extractArchiveData"

@Injectable()
export class DataImportService {
  constructor(
    private readonly providersService: DataImportProvidersService,
    @Inject(DataImportRepositorySymbol)
    private readonly dataImportRepository: DataImportRepositoryInterface,
  ) {}

  async import(args: { userId: string, source: DataImportSourceEnum, archive: Buffer | Uint8Array }): Promise<{ importId: string, result: DataImportRawResultType }> {
    const provider = this.providersService.findService(args.source)
    const files = await extractArchiveData(args.archive)

    provider.validateFiles({ files })

    const result = await provider.import({ files })
    const dataImport = await this.dataImportRepository.create({
      userId: args.userId,
      source: args.source,
      result,
    })

    return { importId: dataImport.id, result }
  }

  async getById(args: { id: string, userId: string }) {
    const dataImport = await this.dataImportRepository.getById({ id: args.id })

    if (!dataImport) {
      throw new DataImportNotFoundError({ dataImportId: args.id })
    }

    if (dataImport.userId !== args.userId) {
      throw new DataImportUnauthorizedError({ userId: args.userId, dataImportId: args.id })
    }

    return dataImport
  }

  async getByUserId(args: { userId: string, limit?: number, offset?: number }) {
    return this.dataImportRepository.getByUserId(args)
  }
}
