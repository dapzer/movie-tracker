import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const requestChangeEmailSchema = z.object({
  email: z.email().meta({ example: "user@example.com" }),
})

export class RequestChangeEmailDto extends createZodDto(requestChangeEmailSchema) {}
