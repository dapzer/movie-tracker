import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { DataImportSourceEnum } from "@/services/dataImport/dto/importSource.dto"

export const importDataQuerySchema = z.object({
  source: z.enum([DataImportSourceEnum.LETTERBOXD, DataImportSourceEnum.TRAKT]),
})

export class ImportDataQueryDto extends createZodDto(importDataQuerySchema) {}
