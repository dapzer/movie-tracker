import { DataImportSourceEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

export const importDataQuerySchema = z.object({
  source: z.enum(DataImportSourceEnum),
})

export class ImportDataQueryDto extends createZodDto(importDataQuerySchema) {}
