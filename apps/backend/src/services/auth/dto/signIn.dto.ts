import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const signInSchema = z.object({
  email: z.string().email().meta({ example: "user@example.com" }),
  password: z.string().min(8).max(32).meta({ example: "StrongPass123" }),
})

export class SignInDto extends createZodDto(signInSchema) {}
