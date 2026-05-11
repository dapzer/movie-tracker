import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const signUpSchema = z.object({
  email: z.email().meta({ example: "user@example.com" }),
  password: z.string().min(8).max(32).meta({ example: "StrongPass123" }),
  name: z.string().min(1).max(32).meta({ example: "John Doe" }),
})

export class SignUpDto extends createZodDto(signUpSchema) {}
