import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const notificationMediaListSchema = z.object({
  id: z.uuid().meta({ format: "uuid" }),
  title: z.string().meta({ example: "My Favorite Movies" }),
})

const notificationMediaReleaseEpisodeSchema = z.object({
  seasonNumber: z.number().meta({ example: 1 }),
  episodeNumber: z.number().meta({ example: 2 }),
})

export class NotificationMediaListDto extends createZodDto(notificationMediaListSchema) {}

export class NotificationMediaReleaseEpisodeDto extends createZodDto(notificationMediaReleaseEpisodeSchema) {}
