import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const confirmChangeEmailSchema = z.object({
  token: z.string().meta({ example: "reset-token-abc123" }),
})

export class ConfirmChangeEmailDto extends createZodDto(confirmChangeEmailSchema) {}
