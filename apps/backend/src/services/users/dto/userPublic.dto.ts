import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const userPublicSchema = z.object({
  id: z.uuid().meta({ format: "uuid", example: "a23d2b67-8a7e-4f70-9c8b-0a8f7a53c021" }),
  name: z.string().meta({ example: "Raphaël Ambrosius Costeau" }),
  image: z.string().optional().meta({ example: "https://avatars.githubusercontent.com/u/00000?v=4" }),
  createdAt: zDateTimeString.meta({ format: "date-time", example: "2026-04-28T12:34:56.000Z" }),
})

const userPaginatedSchema = z.object({
  items: z.array(userPublicSchema),
  totalCount: z.number().meta({ example: 25 }),
})

export class UserPublicDto extends createZodDto(userPublicSchema) {}
export class UserPaginatedDto extends createZodDto(userPaginatedSchema) {}
