import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const uuidSchema = z.object({
  id: z.string().uuid().meta({ format: "uuid" }),
})

export class UuidDto extends createZodDto(uuidSchema) {}
