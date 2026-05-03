import {
  NotificationMetaResponseType,
  NotificationType,
  NotificationTypeEnum,
} from "@movie-tracker/types"
import { ApiProperty, getSchemaPath } from "@nestjs/swagger"
import {
  NotificationMetaMediaListLikeDto,
  NotificationMetaMediaReleaseDto,
  NotificationMetaMediaStatusUpdateDto,
  NotificationMetaUserFollowDto,
} from "./notificationMeta.dto"

export class NotificationDto implements Omit<NotificationType, "meta"> {
  @ApiProperty({ type: String, format: "uuid" })
  id: string

  @ApiProperty({ type: String, format: "uuid" })
  userId: string

  @ApiProperty({ enum: NotificationTypeEnum, example: NotificationTypeEnum.USER_FOLLOW })
  type: NotificationTypeEnum

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(NotificationMetaUserFollowDto) },
      { $ref: getSchemaPath(NotificationMetaMediaListLikeDto) },
      { $ref: getSchemaPath(NotificationMetaMediaReleaseDto) },
      { $ref: getSchemaPath(NotificationMetaMediaStatusUpdateDto) },
    ],
  })
  meta: NotificationMetaResponseType

  @ApiProperty({ type: String, format: "date-time" })
  readAt: Date | undefined

  @ApiProperty({ type: String, format: "date-time" })
  createdAt: Date
}
