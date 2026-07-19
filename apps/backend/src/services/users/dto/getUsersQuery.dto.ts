import { createZodDto } from "nestjs-zod"
import { z } from "zod"

export const paginationSchema = z.object({
  offset: z.coerce.number().min(0).optional().default(0).meta({ example: 4, default: 0 }),
  limit: z.coerce.number().min(1).max(20).optional().meta({ example: 4 }),
  searchTerm: z.string().trim().optional().meta({ example: "john" }),
})

export class GetUsersQueryDto extends createZodDto(paginationSchema) {}
