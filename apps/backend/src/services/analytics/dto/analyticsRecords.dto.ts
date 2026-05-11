import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const analyticsRecordsSchema = z.object({
  mediaDetails: z.number().meta({ example: 50000, description: "Number of media details records" }),
  mediaItems: z.number().meta({ example: 15000, description: "Number of media items" }),
  users: z.number().meta({ example: 5000, description: "Number of users" }),
  mediaLists: z.number().meta({ example: 10000, description: "Number of media lists" }),
  mediaRatings: z.number().meta({ example: 100000, description: "Number of media ratings" }),
})

export class AnalyticsRecordsDto extends createZodDto(analyticsRecordsSchema) {}
