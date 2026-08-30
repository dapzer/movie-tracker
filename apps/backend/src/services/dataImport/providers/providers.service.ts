import { DataImportSourceEnum } from "@movie-tracker/types"
import { Inject, Injectable } from "@nestjs/common"
import { UnsupportedDataImportSourceError } from "@/shared/errors/dataImport"
import { DataImportProvidersOptsSymbol, Opts } from "./constants"
import { BaseService } from "./services/base/base"

@Injectable()
export class DataImportProvidersService {
  constructor(@Inject(DataImportProvidersOptsSymbol) private readonly opts: Opts) {}

  findService(source: DataImportSourceEnum): BaseService {
    const service = this.opts.services.find(s => s.name === source)

    if (!service) {
      throw new UnsupportedDataImportSourceError({ source })
    }

    return service
  }
}
