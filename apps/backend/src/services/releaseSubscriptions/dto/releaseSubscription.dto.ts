import { MediaTypeEnum } from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { MediaDetailsDto } from "@/services/mediaDetails/dto/mediaDetails.dto"
import { zDateTimeString } from "@/shared/dto/zod.utils"

const releaseSubscriptionSchema = z.object({
  id: z.uuid().meta({ format: "uuid" }),
  mediaId: z.number().meta({ example: 550 }),
  mediaType: z.enum(MediaTypeEnum).meta({ enum: MediaTypeEnum }),
  mediaDetailsId: z.uuid().meta({ format: "uuid" }),
  userId: z.uuid().meta({ format: "uuid" }),
  lastReleasedAt: zDateTimeString.nullable().optional().meta({ format: "date-time", nullable: true }),
  completedAt: zDateTimeString.nullable().optional().meta({ format: "date-time", nullable: true }),
  createdAt: zDateTimeString.meta({ format: "date-time" }),
})

const releaseSubscriptionWithDetailsSchema = releaseSubscriptionSchema.extend({
  mediaDetails: MediaDetailsDto.schema,
})

const releaseSubscriptionsResponseSchema = z.object({
  items: z.array(releaseSubscriptionWithDetailsSchema),
  totalCount: z.number().meta({ example: 10 }),
  totalSubscriptionsCount: z.number().meta({ example: 25 }),
})

export class ReleaseSubscriptionDto extends createZodDto(releaseSubscriptionSchema) {}

export class ReleaseSubscriptionWithDetailsDto extends createZodDto(releaseSubscriptionWithDetailsSchema) {}

export class ReleaseSubscriptionsResponseDto extends createZodDto(releaseSubscriptionsResponseSchema) {}
