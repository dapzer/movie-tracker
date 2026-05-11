import { createZodDto } from "nestjs-zod"
import { z } from "zod"

export function PaginatedDto<T>(classRef: { schema: z.ZodType<T> }) {
  const paginatedSchema = z.object({
    items: z.array(classRef.schema),
    totalCount: z.number().meta({ example: 1 }),
  })

  return createZodDto(paginatedSchema)
}
