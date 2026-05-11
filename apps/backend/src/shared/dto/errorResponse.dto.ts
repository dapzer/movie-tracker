import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const errorResponseSchema = z.object({
  statusCode: z.number().meta({ example: 400 }),
  message: z.string().meta({ example: "Bad Request" }),
  timestamp: z.string().meta({ example: "2026-04-29T12:34:56.789Z" }),
  path: z.string().meta({ example: "/api/media-ratings" }),
})

export class ErrorResponseDto extends createZodDto(errorResponseSchema) {}
