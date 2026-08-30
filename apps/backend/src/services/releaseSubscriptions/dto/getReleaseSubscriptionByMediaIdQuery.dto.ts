import { MediaTypeEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const getReleaseSubscriptionByMediaIdQuerySchema = z.object({
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum }),
})

export class GetReleaseSubscriptionByMediaIdQueryDto extends createZodDto(getReleaseSubscriptionByMediaIdQuerySchema) {}
