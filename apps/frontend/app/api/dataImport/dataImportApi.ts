import type { DataImportsPaginatedType } from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type { GetDataImportsArgs, ImportDataArgs, ImportDataResponse } from "~/api/dataImport/dataImportApiTypes"
import { api } from "~/api/instance"

export function importData(args: ImportDataArgs) {
  const formData = new FormData()
  formData.append("archive", args.file)

  return api.postFormData<ImportDataResponse>("data-import", formData, {
    params: {
      source: args.source,
    },
  })
}

export function getDataImports(args: GetDataImportsArgs, options?: Omit<RequestOptions, "params">) {
  return api.get<DataImportsPaginatedType>("data-import", {
    ...options,
    params: {
      limit: args.limit,
      offset: args.offset,
    },
  })
}
