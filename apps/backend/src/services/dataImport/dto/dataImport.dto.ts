import { DataImportSourceEnum, DataImportStatusEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { PaginatedDto } from "@/shared/dto/paginated.dto"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const dataImportBaseSchema = z.object({
  id: z.uuid().meta({ format: "uuid" }),
  userId: z.uuid().meta({ format: "uuid" }),
  source: z.enum(DataImportSourceEnum),
  status: z.enum(DataImportStatusEnum),
  processedAt: zDateTimeString.nullable().optional(),
  createdAt: zDateTimeString,
})

export const dataImportSchema = dataImportBaseSchema.extend({
  result: z.unknown().meta({ description: "Raw import result payload" }),
})

export const importDataResponseSchema = z.object({
  importId: z.uuid().meta({ format: "uuid" }),
  result: z.unknown().meta({ description: "Raw import result payload" }),
})

export class DataImportListItemDto extends createZodDto(dataImportBaseSchema) {}

export class DataImportDto extends createZodDto(dataImportSchema) {}

export class ImportDataResponseDto extends createZodDto(importDataResponseSchema) {}

export const processDataImportResponseSchema = z.object({
  createdMediaLists: z.number().meta({ example: 2 }),
  createdMediaItems: z.number().meta({ example: 42 }),
  skippedMediaItems: z.array(z.number()).meta({ example: [1396, 27205] }),
  notFoundListIds: z.array(z.string()).meta({ example: ["12345"] }),
  createdRatings: z.number().meta({ example: 15 }),
  skippedRatings: z.array(z.number()).meta({ example: [1396] }),
  createdReviews: z.number().meta({ example: 3 }),
  skippedReviews: z.array(z.number()).meta({ example: [27205] }),
})

export class ProcessDataImportResponseDto extends createZodDto(processDataImportResponseSchema) {}

export class DataImportsPaginatedDto extends PaginatedDto(DataImportListItemDto) {}
