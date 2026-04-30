import {
  MediaItemStatusNameEnum,
  NotificationMetaResponseType,
  NotificationTypeEnum,
} from "@movie-tracker/types"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { MediaDetailsDto } from "@/services/mediaDetails/dto/mediaDetails.dto"
import { NotificationMediaListDto, NotificationMediaReleaseEpisodeDto } from "./notificationLeaf.dto"
import { NotificationUserDto } from "./notificationUser.dto"

export class NotificationMetaUserFollowDto implements
  Extract<
    NotificationMetaResponseType,
    { type: NotificationTypeEnum.USER_FOLLOW }
  > {
  @ApiProperty({ enum: [NotificationTypeEnum.USER_FOLLOW] })
  type: NotificationTypeEnum.USER_FOLLOW

  @ApiProperty({ type: NotificationUserDto })
  actorUser: NotificationUserDto
}

export class NotificationMetaMediaListLikeDto implements
  Extract<
    NotificationMetaResponseType,
    { type: NotificationTypeEnum.MEDIA_LIST_LIKE }
  > {
  @ApiProperty({ enum: [NotificationTypeEnum.MEDIA_LIST_LIKE] })
  type: NotificationTypeEnum.MEDIA_LIST_LIKE

  @ApiProperty({ type: NotificationUserDto })
  actorUser: NotificationUserDto

  @ApiProperty({ type: NotificationMediaListDto })
  mediaList: NotificationMediaListDto
}

export class NotificationMetaMediaReleaseDto implements
  Extract<
    NotificationMetaResponseType,
    { type: NotificationTypeEnum.MEDIA_RELEASE }
  > {
  @ApiProperty({ enum: [NotificationTypeEnum.MEDIA_RELEASE] })
  type: NotificationTypeEnum.MEDIA_RELEASE

  @ApiProperty({ type: MediaDetailsDto })
  mediaDetails: MediaDetailsDto

  @ApiPropertyOptional({ type: [NotificationMediaReleaseEpisodeDto] })
  episodes?: NotificationMediaReleaseEpisodeDto[]
}

export class NotificationMetaMediaStatusUpdateDto implements
  Extract<
    NotificationMetaResponseType,
    { type: NotificationTypeEnum.MEDIA_STATUS_UPDATE }
  > {
  @ApiProperty({ enum: [NotificationTypeEnum.MEDIA_STATUS_UPDATE] })
  type: NotificationTypeEnum.MEDIA_STATUS_UPDATE

  @ApiProperty({ type: MediaDetailsDto })
  mediaDetails: MediaDetailsDto

  @ApiProperty({ enum: MediaItemStatusNameEnum, example: "NOT_VIEWED" })
  previousStatus: MediaItemStatusNameEnum

  @ApiProperty({ enum: MediaItemStatusNameEnum, example: "WATCHING_NOW" })
  currentStatus: MediaItemStatusNameEnum
}
