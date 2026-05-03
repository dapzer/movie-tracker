import { applyDecorators } from "@nestjs/common"
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { NotificationDto } from "@/services/notifications/dto/notification.dto"
import { NotificationCountDto } from "@/services/notifications/dto/notificationCount.dto"
import {
  NotificationMetaMediaListLikeDto,
  NotificationMetaMediaReleaseDto,
  NotificationMetaMediaStatusUpdateDto,
  NotificationMetaUserFollowDto,
} from "@/services/notifications/dto/notificationMeta.dto"
import { NotificationPaginatedDto } from "@/services/notifications/dto/notificationPaginated.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function NotificationsControllerDocs() {
  return applyDecorators(ApiTags("Notifications"))
}

export function GetNotificationsByUserIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get user notifications" }),
    ApiSecurity("cookie"),
    ApiExtraModels(
      NotificationMetaUserFollowDto,
      NotificationMetaMediaListLikeDto,
      NotificationMetaMediaReleaseDto,
      NotificationMetaMediaStatusUpdateDto,
    ),
    ApiOkResponse({ description: "Notifications list", type: NotificationPaginatedDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to fetch notifications", type: ErrorResponseDto }),
  )
}

export function MarkNotificationsAsReadDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Mark selected notifications as read" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Notifications marked as read", type: NotificationDto, isArray: true }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiBadRequestResponse({ description: "Invalid notification ids", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to mark notifications as read", type: ErrorResponseDto }),
  )
}

export function MarkAllNotificationsAsReadDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Mark all notifications as read" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "All notifications marked as read", type: NotificationDto, isArray: true }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to mark all notifications as read", type: ErrorResponseDto }),
  )
}

export function GetUnreadNotificationCountDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get unread notifications count" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Unread notifications count", type: NotificationCountDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to fetch unread notifications count", type: ErrorResponseDto }),
  )
}
