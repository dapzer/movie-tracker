import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const notificationCountSchema = z.object({
  unread: z.number().meta({ example: 3 }),
})

export class NotificationCountDto extends createZodDto(notificationCountSchema) {}
