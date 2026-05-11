import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const confirmEmailSchema = z.object({
  token: z.string().meta({ example: "reset-token-abc123" }),
})

export class ConfirmEmailDto extends createZodDto(confirmEmailSchema) {}
