import { NotificationCountType } from "@movie-tracker/types"
import { ApiProperty } from "@nestjs/swagger"

export class NotificationCountDto implements NotificationCountType {
  @ApiProperty({ type: Number, example: 3 })
  unread: number
}
