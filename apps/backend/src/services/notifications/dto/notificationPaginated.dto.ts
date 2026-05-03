import { NotificationResponseType } from "@movie-tracker/types"
import { PaginatedDto } from "@/shared/dto/paginated.dto"
import { NotificationDto } from "./notification.dto"

export class NotificationPaginatedDto extends PaginatedDto(NotificationDto) implements NotificationResponseType {}
