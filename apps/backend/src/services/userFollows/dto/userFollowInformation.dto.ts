import { UserFollowInformationType } from "@movie-tracker/types"
import { ApiProperty } from "@nestjs/swagger"

export class UserFollowInformationDto implements UserFollowInformationType {
  @ApiProperty({ type: Number, example: 123 })
  followersCount!: number

  @ApiProperty({ type: Boolean, example: false })
  isFollowing!: boolean
}
