import { NotificationUserType } from "@movie-tracker/types"
import { ApiProperty } from "@nestjs/swagger"

export class NotificationUserDto implements NotificationUserType {
  @ApiProperty({ type: String, format: "uuid" })
  id: string

  @ApiProperty({ type: String, example: "John Doe" })
  name: string

  @ApiProperty({ type: String, example: "https://cdn.example.com/avatar.jpg" })
  image: string
}
