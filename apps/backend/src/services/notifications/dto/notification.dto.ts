import {
  NotificationTypeEnum,
} from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import {
  NotificationMetaMediaListLikeDto,
  NotificationMetaMediaReleaseDto,
  NotificationMetaMediaStatusUpdateDto,
  NotificationMetaUserFollowDto,
} from "./notificationMeta.dto"

const notificationMetaSchema = z.discriminatedUnion("type", [
  NotificationMetaUserFollowDto.schema,
  NotificationMetaMediaListLikeDto.schema,
  NotificationMetaMediaReleaseDto.schema,
  NotificationMetaMediaStatusUpdateDto.schema,
])

const notificationSchema = z.object({
  id: z.string().uuid().meta({ format: "uuid" }),
  userId: z.string().uuid().meta({ format: "uuid" }),
  type: z.enum(NotificationTypeEnum).meta({ enum: NotificationTypeEnum, example: NotificationTypeEnum.USER_FOLLOW }),
  meta: notificationMetaSchema,
  readAt: z.any().meta({ format: "date-time" }),
  createdAt: z.any().meta({ format: "date-time" }),
})

export class NotificationDto extends createZodDto(notificationSchema) {
}
