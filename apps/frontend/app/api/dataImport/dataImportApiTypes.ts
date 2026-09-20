import type { DataImportRawResultType, DataImportSourceEnum, PaginationType } from "@movie-tracker/types"

export interface ImportDataArgs {
  source: DataImportSourceEnum
  file: File
}

export interface ImportDataResponse {
  importId: string
  result: DataImportRawResultType
}

export type GetDataImportsArgs = PaginationType
