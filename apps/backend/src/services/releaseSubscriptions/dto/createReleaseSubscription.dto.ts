import { MediaTypeEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const createReleaseSubscriptionSchema = z.object({
  mediaId: z.number(),
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum }),
})

export class CreateReleaseSubscriptionDto extends createZodDto(createReleaseSubscriptionSchema) {}
