import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const resetPasswordByTokenSchema = z.object({
  token: z.string().meta({ example: "reset-token-abc123" }),
  password: z.string().min(8).max(32).meta({ example: "NewStrongPass123" }),
})

export class ResetPasswordByTokenDto extends createZodDto(resetPasswordByTokenSchema) {}
