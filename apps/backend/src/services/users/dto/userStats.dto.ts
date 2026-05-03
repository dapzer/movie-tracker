import { UserStatsType } from "@movie-tracker/types"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNumber, IsOptional } from "class-validator"

export class UserStatsDto implements UserStatsType {
  @ApiProperty({ type: Number, example: 12 })
  @IsNumber()
  mediaListCount: number

  @ApiPropertyOptional({ type: Number, example: 45 })
  @IsOptional()
  @IsNumber()
  mediaRatingsCount?: number

  @ApiProperty({ type: Number, example: 30 })
  @IsNumber()
  mediaListLikeCount: number
}
