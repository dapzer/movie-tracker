import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const markNotificationsAsReadSchema = z.object({
  ids: z.array(z.string().uuid()).meta({ format: "uuid", example: [
    "c1a9b6e2-3f4d-4a7c-9d2e-123456789abc",
    "b2b8c7d1-4e5f-4a6b-8c3d-987654321def",
  ] }),
})

export class MarkNotificationsAsReadDto extends createZodDto(markNotificationsAsReadSchema) {}
