import type { PaginationType } from "@movie-tracker/types"
import {
  DataImportRawResultType,
  DataImportSourceEnum,
  DataImportsPaginatedType,
  DataImportStatusEnum,
  DataImportType,
} from "@movie-tracker/types"

export const DataImportRepositorySymbol = Symbol("DataImportRepository")

export interface DataImportRepositoryInterface {
  create: (args: {
    userId: string
    source: DataImportSourceEnum
    result: DataImportRawResultType
  }) => Promise<DataImportType>

  getById: (args: {
    id: string
  }) => Promise<DataImportType | undefined>

  getByUserId: (args: {
    userId: string
  } & PaginationType) => Promise<DataImportsPaginatedType>

  updateStatus: (args: {
    id: string
    status: DataImportStatusEnum
    processedAt?: Date
  }) => Promise<DataImportType>
}
