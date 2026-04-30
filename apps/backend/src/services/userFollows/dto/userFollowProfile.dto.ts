import { UserFollowProfileType } from "@movie-tracker/types"
import { ApiProperty } from "@nestjs/swagger"

export class UserFollowProfileDto implements UserFollowProfileType {
  @ApiProperty({ type: String, format: "uuid", example: "a23d2b67-8a7e-4f70-9c8b-0a8f7a53c021" })
  id!: string

  @ApiProperty({ type: String, example: "Raphaël Ambrosius Costeau" })
  name!: string

  @ApiProperty({ type: String, example: "https://avatars.githubusercontent.com/u/00000?v=4" })
  image!: string

  @ApiProperty({ type: Number, example: 123 })
  followersCount!: number

  @ApiProperty({ type: Boolean, example: false })
  isFollowing!: boolean
}
