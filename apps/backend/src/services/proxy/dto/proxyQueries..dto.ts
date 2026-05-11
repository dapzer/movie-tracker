import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { zBooleanQuery } from "@/shared/dto/zod.utils"

const proxyQueriesSchema = z.object({
  size: z.coerce.number().optional(),
  keepOriginalType: zBooleanQuery.optional(),
})

export class ProxyQueriesDto extends createZodDto(proxyQueriesSchema) {}
