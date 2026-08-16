import { Inject, Injectable } from "@nestjs/common"
import { UnsupportedDataImportSourceError } from "@/shared/errors/dataImport"
import { DataImportProvidersOptsSymbol, Opts } from "./constants"
import { BaseProvider } from "./services/base/baseProvider"

@Injectable()
export class DataImportProvidersService {
  constructor(@Inject(DataImportProvidersOptsSymbol) private readonly opts: Opts) {}

  findService(source: string): BaseProvider {
    const service = this.opts.services.find(s => s.name === source)

    if (!service) {
      throw new UnsupportedDataImportSourceError({ source })
    }

    return service
  }
}
