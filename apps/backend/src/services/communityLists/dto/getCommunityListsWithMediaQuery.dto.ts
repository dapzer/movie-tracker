import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"
import { PaginationDto } from "@/shared/dto/pagination.dto"

export class GetCommunityListsWithMediaQueryDto extends PaginationDto {
  @ApiProperty({ type: Number, example: 123 })
  @Type(() => Number)
  @IsNumber()
  mediaId: number

  @ApiPropertyOptional({ type: String, example: "anime" })
  @IsOptional()
  @IsString()
  title?: string
}
