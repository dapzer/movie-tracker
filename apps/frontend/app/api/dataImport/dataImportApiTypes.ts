import type { DataImportRawResultType, DataImportSourceEnum, MediaItemStatusNameEnum, PaginationType } from "@movie-tracker/types"

export interface ImportDataArgs {
  source: DataImportSourceEnum
  file: File
}

export interface ImportDataResponse {
  importId: string
  result: DataImportRawResultType
}

export type GetDataImportsArgs = PaginationType

export interface ProcessDataImportBucketConfig {
  mediaListId?: string
  newListTitle?: string
  status: MediaItemStatusNameEnum
}

export interface ProcessDataImportListConfig {
  id: string
  mediaListId?: string
  status: MediaItemStatusNameEnum
}

export interface ProcessDataImportConfig {
  watched?: ProcessDataImportBucketConfig
  watchList?: ProcessDataImportBucketConfig
  ratings?: boolean
  reviews?: boolean
  lists?: ProcessDataImportListConfig[]
}

export interface ProcessDataImportArgs {
  id: string
  config: ProcessDataImportConfig
}
