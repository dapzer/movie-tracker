import type { DataImportProcessSummaryType, DataImportsPaginatedType, DataImportType } from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type { GetDataImportsArgs, ImportDataArgs, ImportDataResponse, ProcessDataImportArgs } from "~/api/dataImport/dataImportApiTypes"
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

export function getDataImportById(id: string, options?: Omit<RequestOptions, "params">) {
  return api.get<DataImportType>(`data-import/${id}`, options)
}

export function processDataImport(args: ProcessDataImportArgs) {
  return api.post<DataImportProcessSummaryType>(`data-import/${args.id}/process`, args.config)
}
