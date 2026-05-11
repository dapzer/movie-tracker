import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const getRecoverPasswordEmailSchema = z.object({
  email: z.string().email().meta({ example: "user@example.com" }),
})

export class GetRecoverPasswordEmailDto extends createZodDto(getRecoverPasswordEmailSchema) {}
