import { UserFollowType } from "@movie-tracker/types"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { UserFollowProfileDto } from "./userFollowProfile.dto"

export class UserFollowDto implements UserFollowType {
  @ApiProperty({ type: String, format: "uuid", example: "a23d2b67-8a7e-4f70-9c8b-0a8f7a53c021" })
  id!: string

  @ApiProperty({ type: String, format: "uuid", example: "b10c5d0d-4ce2-4e31-8d1a-7d1a0b944b3a" })
  followerId!: string

  @ApiProperty({ type: String, format: "uuid", example: "c0a5db1e-7a67-4b60-8b1f-53f3a7c3d7b1" })
  followingId!: string

  @ApiProperty({ type: String, format: "date-time", example: "2026-04-28T12:34:56.000Z" })
  createdAt!: Date

  @ApiPropertyOptional({ type: UserFollowProfileDto })
  followerUserProfile?: UserFollowProfileDto

  @ApiPropertyOptional({ type: UserFollowProfileDto })
  followingUserProfile?: UserFollowProfileDto
}
