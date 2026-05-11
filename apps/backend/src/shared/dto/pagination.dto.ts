import { createZodDto } from "nestjs-zod"
import { z } from "zod"

export const paginationSchema = z.object({
  offset: z.coerce.number().min(0).optional().default(0).meta({ example: 4, default: 0 }),
  limit: z.coerce.number().min(1).max(20).optional().default(20).meta({ example: 4, default: 20 }),
})

export class PaginationDto extends createZodDto(paginationSchema) {}

export type PaginationDtoType = z.infer<typeof paginationSchema>
