import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const notificationUserSchema = z.object({
  id: z.string().uuid().meta({ format: "uuid" }),
  name: z.string().meta({ example: "John Doe" }),
  image: z.string().meta({ example: "https://cdn.example.com/avatar.jpg" }),
})

export class NotificationUserDto extends createZodDto(notificationUserSchema) {}
