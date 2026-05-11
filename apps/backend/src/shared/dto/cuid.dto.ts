import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const cuidSchema = z.object({
  id: z.string(),
})

export class CuidDto extends createZodDto(cuidSchema) {}
