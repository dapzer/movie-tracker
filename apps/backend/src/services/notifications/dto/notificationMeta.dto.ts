import {
  NotificationTypeEnum,
} from "@movie-tracker/types"
import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { MediaDetailsDto } from "@/services/mediaDetails/dto/mediaDetails.dto"
import { NotificationMediaListDto, NotificationMediaReleaseEpisodeDto } from "./notificationLeaf.dto"
import { NotificationUserDto } from "./notificationUser.dto"

const notificationMetaUserFollowSchema = z.object({
  type: z.literal(NotificationTypeEnum.USER_FOLLOW).meta({ enum: [NotificationTypeEnum.USER_FOLLOW] }),
  actorUser: NotificationUserDto.schema,
})

const notificationMetaMediaListLikeSchema = z.object({
  type: z.literal(NotificationTypeEnum.MEDIA_LIST_LIKE).meta({ enum: [NotificationTypeEnum.MEDIA_LIST_LIKE] }),
  actorUser: NotificationUserDto.schema,
  mediaList: NotificationMediaListDto.schema,
})

const notificationMetaMediaReleaseSchema = z.object({
  type: z.literal(NotificationTypeEnum.MEDIA_RELEASE).meta({ enum: [NotificationTypeEnum.MEDIA_RELEASE] }),
  mediaDetails: MediaDetailsDto.schema,
  episodes: z.array(NotificationMediaReleaseEpisodeDto.schema).optional(),
})

const notificationMetaMediaStatusUpdateSchema = z.object({
  type: z
    .literal(NotificationTypeEnum.MEDIA_STATUS_UPDATE)
    .meta({ enum: [NotificationTypeEnum.MEDIA_STATUS_UPDATE] }),
  mediaDetails: MediaDetailsDto.schema,
  previousStatus: z.string().meta({ example: "NOT_VIEWED" }),
  currentStatus: z.string().meta({ example: "WATCHING_NOW" }),
})

export class NotificationMetaUserFollowDto extends createZodDto(notificationMetaUserFollowSchema) {}

export class NotificationMetaMediaListLikeDto extends createZodDto(notificationMetaMediaListLikeSchema) {}

export class NotificationMetaMediaReleaseDto extends createZodDto(notificationMetaMediaReleaseSchema) {}

export class NotificationMetaMediaStatusUpdateDto extends createZodDto(notificationMetaMediaStatusUpdateSchema) {}
